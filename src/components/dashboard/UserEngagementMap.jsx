import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

export default function UserEngagementMap({ tenants }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filter + sort data
  const engagementData = useMemo(() => {
    return tenants
      .map((t) => ({
        name: t.display_name,
        users: t.usage_stats?.active_users || 0,
      }))
      .filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.users - a.users);
  }, [tenants, search]);

  const totalPages = Math.ceil(engagementData.length / itemsPerPage);

  const paginatedData = engagementData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      {/* Header */}
      <CardHeader className="border-b border-slate-100/50 pb-3 pt-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">User Engagement</h3>
            <p className="text-sm text-slate-500">
              Schools by active users
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search school..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full mb-3 p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        {/* Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={paginatedData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              fontSize={13}
              width={120}
              tick={{ fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "1rem",
                border: "1px solid #e0e7ff",
                background: "white",
              }}
            />
            <Bar
              dataKey="users"
              fill="#8b5cf6"
              radius={[0, 4, 4, 0]}
              barSize={25}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 rounded-xl ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className={`px-4 py-2 rounded-xl ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
