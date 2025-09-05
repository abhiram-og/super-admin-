
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Send, Rocket, Loader2 } from 'lucide-react';
import { AIQuiz, AIQuizCampaign } from '@/api/entities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { withRetry } from "@/components/utils/withRetry";

export default function AIQuizManager({ tenants }) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [targetSchools, setTargetSchools] = useState(['all']);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    withRetry(() => AIQuiz.list(), { maxConcurrent: 1 }).then(setQuizzes);
  }, []);

  const handleSendQuiz = async () => {
    if (!selectedQuiz) return;
    setIsSending(true);
    try {
      const quiz = quizzes.find(q => q.id === selectedQuiz);
      await withRetry(() => AIQuizCampaign.create({
         quiz_id: selectedQuiz,
         name: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ${quiz.title}`,
         frequency: frequency,
         target_tenants: targetSchools,
         status: 'sent',
         sent_at: new Date().toISOString()
      }), { baseDelay: 1200, maxConcurrent: 1 });
      // In a real app, this would trigger a backend job to send notifications.
      console.log(`Quiz campaign for ${quiz.title} sent to ${targetSchools.join(', ')}`);
    } catch (error) {
      console.error("Failed to send quiz campaign", error);
    } finally {
      setTimeout(() => setIsSending(false), 1500); // Simulate network delay
    }
  };

  const getTargetLabel = () => {
    if (targetSchools.includes('all') || targetSchools.length === tenants.length) return "All Schools";
    if (targetSchools.length === 1) return tenants.find(t => t.id === targetSchools[0])?.display_name || '1 School';
    return `${targetSchools.length} Schools Selected`;
  };

  return (
    <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Quiz Campaign Manager</h3>
            <p className="text-sm text-slate-500">Engage students with AI-powered quizzes.</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Select onValueChange={setSelectedQuiz}>
            <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Select Quiz..." /></SelectTrigger>
            <SelectContent>
              {quizzes.map(q => <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select defaultValue="weekly" onValueChange={setFrequency}>
            <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-12 w-full justify-start text-left font-normal">
                {getTargetLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              <DropdownMenuLabel>Target Schools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={targetSchools.includes('all') || targetSchools.length === tenants.length}
                onCheckedChange={(checked) => setTargetSchools(checked ? tenants.map(t => t.id) : [])}
              >
                All Schools
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {tenants.map(tenant => (
                <DropdownMenuCheckboxItem
                  key={tenant.id}
                  checked={targetSchools.includes(tenant.id)}
                  onCheckedChange={(checked) => {
                    const newTargets = checked
                      ? [...targetSchools, tenant.id]
                      : targetSchools.filter(id => id !== tenant.id);
                    if (newTargets.includes('all')) newTargets.shift();
                    setTargetSchools(newTargets);
                  }}
                >
                  {tenant.display_name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full md:w-auto flex-shrink-0">
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl h-12"
            onClick={handleSendQuiz}
            disabled={isSending || !selectedQuiz}
          >
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            {isSending ? 'Launching...' : 'Launch Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
