import React from 'react';
import { useEdgeStore } from '../../store';
import { Server, Wifi, WifiOff, HardDrive, RefreshCw, Activity, AlertTriangle, CloudRain, Database } from 'lucide-react';

export default function EdgeBoxPage() {
  const { isOnline, pendingSyncQueue, syncHistory, toggleConnection, triggerOfflineEvent, syncNow } = useEdgeStore();

  const handleSimulateEvent = () => {
    const events = ['SYNC_ATTENDANCE', 'OFFLINE_REGISTRATION', 'COURSE_PROGRESS_UPDATE'];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    triggerOfflineEvent(randomEvent, { data: 'Demo offline data payload' });
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a5f] flex items-center gap-3">
          <Server size={32} /> Sahakar Edge Box Simulator
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Control and monitor the local Raspberry Pi hardware cache behaviors.</p>
        <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-[#1e3a5f] font-semibold text-xs rounded-full border border-blue-200 shadow-sm">
          ⚡ HARDWARE INTEGRATION
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Network Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <div className={`p-5 rounded-full mb-5 transition-colors ${isOnline ? 'bg-green-50 text-[#2d7a3f] border-4 border-green-100' : 'bg-red-50 text-[#b91c1c] border-4 border-red-100'}`}>
            {isOnline ? <Wifi size={48} /> : <WifiOff size={48} />}
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Network Status</h2>
          <p className={`font-bold mb-6 tracking-wide text-sm ${isOnline ? 'text-[#2d7a3f]' : 'text-[#b91c1c]'}`}>
            {isOnline ? 'CONNECTED TO CLOUD' : 'OFFLINE (LOCAL MODE)'}
          </p>
          <button 
            onClick={toggleConnection}
            className={`w-full py-3 text-white rounded-xl font-bold transition-colors shadow-sm ${isOnline ? 'bg-gray-800 hover:bg-gray-900' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isOnline ? 'Disconnect Internet (Simulate Outage)' : 'Restore Internet Connection'}
          </button>
        </div>

        {/* Local Storage & Cache Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center gap-3 mb-5 text-[#1e3a5f]">
              <HardDrive size={24} />
              <h2 className="text-xl font-extrabold">Edge Cache</h2>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">LMS Video Content</span>
                  <span className="font-bold text-gray-800">4.2 GB / 32 GB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#c17f24] h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">Local Postgres DB</span>
                  <span className="font-bold text-gray-800">156 MB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#2d7a3f] h-full rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSimulateEvent}
            className="w-full mt-8 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Activity size={18} /> Trigger Offline Action
          </button>
        </div>

        {/* Sync Queue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Database size={120} />
          </div>
          <div>
             <div className="flex items-center gap-3 mb-5 text-[#1e3a5f]">
              <CloudRain size={24} />
              <h2 className="text-xl font-extrabold">Sync Queue</h2>
            </div>
            <div className="text-center py-6">
              <span className="text-6xl font-black text-[#1e3a5f] drop-shadow-sm">{pendingSyncQueue.length}</span>
              <p className="text-gray-500 mt-2 font-medium">Pending Actions to Sync to Django Backend</p>
            </div>
          </div>
          <button 
            onClick={syncNow}
            disabled={!isOnline || pendingSyncQueue.length === 0}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              !isOnline || pendingSyncQueue.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#2d7a3f] text-white hover:bg-green-700 hover:shadow-md'
            }`}
          >
            <RefreshCw size={18} className={isOnline && pendingSyncQueue.some(q => q.status === 'syncing') ? 'animate-spin' : ''} /> 
            Push to Django Cloud
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-[#1e3a5f]">Local Pending Queue</h3>
            {!isOnline && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#b45309] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                <AlertTriangle size={14} /> Offline Mode
              </span>
            )}
          </div>
          <div className="p-0 max-h-[300px] overflow-y-auto">
            {pendingSyncQueue.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium flex flex-col items-center justify-center">
                <Server size={40} className="mb-3 opacity-20" />
                No pending actions. Local Edge Box is in sync with Cloud.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-white sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {pendingSyncQueue.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1e3a5f]">
                        {item.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-5 border-b border-gray-200">
            <h3 className="font-extrabold text-[#1e3a5f]">Cloud Sync History</h3>
          </div>
          <div className="p-0 max-h-[300px] overflow-y-auto">
            {syncHistory.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">No recent syncs</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-white sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {syncHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                        {new Date(item.syncedAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1e3a5f]">
                        {item.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200 shadow-sm">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





