import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Schools from "./Schools";

import CreateSchool from "./CreateSchool";

import Integrations from "./Integrations";

import Compliance from "./Compliance";

import AuditLogs from "./AuditLogs";

import DLTRegistrations from "./DLTRegistrations";

import Complaints from "./Complaints";

import SchoolDetails from "./SchoolDetails";

import IntegrationConfig from "./IntegrationConfig";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Schools: Schools,
    
    CreateSchool: CreateSchool,
    
    Integrations: Integrations,
    
    Compliance: Compliance,
    
    AuditLogs: AuditLogs,
    
    DLTRegistrations: DLTRegistrations,
    
    Complaints: Complaints,
    
    SchoolDetails: SchoolDetails,
    
    IntegrationConfig: IntegrationConfig,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Schools" element={<Schools />} />
                
                <Route path="/CreateSchool" element={<CreateSchool />} />
                
                <Route path="/Integrations" element={<Integrations />} />
                
                <Route path="/Compliance" element={<Compliance />} />
                
                <Route path="/AuditLogs" element={<AuditLogs />} />
                
                <Route path="/DLTRegistrations" element={<DLTRegistrations />} />
                
                <Route path="/Complaints" element={<Complaints />} />
                
                <Route path="/SchoolDetails" element={<SchoolDetails />} />
                
                <Route path="/IntegrationConfig" element={<IntegrationConfig />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}