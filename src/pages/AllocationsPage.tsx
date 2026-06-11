import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';

export default function AllocationsPage() {
  const [empSearch, setEmpSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');

  const { data: allocations = [], isLoading } = useGetAllAllocationsQuery();

  // Filter allocations locally for fast responsiveness
  const filteredAllocations = allocations.filter((alloc) => {
    const resourceName = alloc.resourceId?.fullName || '';
    const projectName = alloc.projectId?.name || '';
    
    const matchesEmp = resourceName.toLowerCase().includes(empSearch.toLowerCase().trim());
    const matchesProj = projectName.toLowerCase().includes(projSearch.toLowerCase().trim());
    
    return matchesEmp && matchesProj;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">View All Allocations</h1>
      </div>

      {/* Filter Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-400 text-sm mr-2">
          <Filter className="w-4 h-4" />
          <span>Quick Search:</span>
        </div>

        {/* Employee Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Resource..."
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Project Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Project..."
            value={projSearch}
            onChange={(e) => setProjSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading allocations data...</div>
        ) : filteredAllocations.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No active or historic allocations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-950">
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Utilisation</th>
                  <th className="px-6 py-4">From Date</th>
                  <th className="px-6 py-4">To Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 text-sm">
                {filteredAllocations.map((alloc) => (
                  <tr key={alloc._id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-50">
                      {alloc.resourceId?.fullName || 'Deactivated Resource'}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {alloc.projectId?.name || 'Archived Project'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-100">
                      {alloc.utilisationPercent}%
                    </td>
                    <td className="px-6 py-4 text-slate-450">
                      {new Date(alloc.fromDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-450">
                      {new Date(alloc.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          alloc.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}
                      >
                        {alloc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stat */}
      <div className="text-right text-xs text-slate-500">
        Showing {filteredAllocations.length} of {allocations.length} allocations.
      </div>
    </div>
  );
}
