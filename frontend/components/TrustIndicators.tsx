'use client'

<<<<<<< HEAD
import { CheckCircle, AlertTriangle, AlertCircle, Award } from 'lucide-react'
import { useAgentReputation } from '@/hooks/useAgentReputation';
=======
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
>>>>>>> 941ae72

interface TrustIndicatorsProps {
  confidence?: number;
}

export default function TrustIndicators({ confidence }: TrustIndicatorsProps) {
<<<<<<< HEAD
  const { reputation } = useAgentReputation();
  
=======
>>>>>>> 941ae72
  // Normalize confidence to 0-100 scale if it's 0-1
  const normalizedConfidence = confidence !== undefined
    ? (confidence <= 1 ? confidence * 100 : confidence)
    : undefined;

<<<<<<< HEAD
  const _getConfidenceLevel = (score: number) => {
=======
  const getConfidenceLevel = (score: number) => {
>>>>>>> 941ae72
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };
<<<<<<< HEAD
  
  const getReputationBadge = (successRate: number, totalSwaps: number) => {
     if (successRate >= 98 && totalSwaps >= 100) return { label: 'Elite', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
     if (successRate >= 95 && totalSwaps >= 50) return { label: 'Veteran', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' };
     if (successRate >= 90 && totalSwaps >= 10) return { label: 'Reliable', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
     return { label: 'New', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
  };

  const badge = reputation ? getReputationBadge(reputation.successRate, reputation.totalSwaps) : null;

=======
>>>>>>> 941ae72

  const getConfidenceStyles = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 50) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

<<<<<<< HEAD
  const _getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-400';
    if (rate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

=======
>>>>>>> 941ae72
  const getConfidenceIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-3 h-3" />;
    if (score >= 50) return <AlertTriangle className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  return (
<<<<<<< HEAD
    <div className="flex items-center gap-4">
       {/* Badge Display */}
       {reputation && (
         <div 
           className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${badge?.color} transition-all duration-300`}
           title={`Success Rate: ${reputation.successRate}% across ${reputation.totalSwaps} swaps`}
         >
           <Award className="w-3.5 h-3.5" />
           <span className="text-xs font-bold uppercase tracking-wider">{badge?.label} Agent</span>
         </div>
       )}

       {/* Confidence Meter (Existing) */}
       {normalizedConfidence !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getConfidenceStyles(normalizedConfidence)} bg-opacity-10 backdrop-blur-sm`}>
            {getConfidenceIcon(normalizedConfidence)}
            <span className="text-xs font-bold uppercase tracking-wider">
              {Math.round(normalizedConfidence)}% Conf.
            </span>
          </div>
       )}
    </div>
  );
=======
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300">
      {/* Header with Status/Confidence */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {normalizedConfidence !== undefined ? 'Analysis Confidence' : 'Secure Trading'}
          </h3>
        </div>

        {normalizedConfidence !== undefined ? (
           <div
             className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${getConfidenceStyles(normalizedConfidence)}`}
             title={`Confidence Score: ${normalizedConfidence.toFixed(1)}%`}
           >
             {getConfidenceIcon(normalizedConfidence)}
             <span className="text-[10px] font-bold uppercase tracking-widest">
               {getConfidenceLevel(normalizedConfidence)}
             </span>
           </div>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30">
            Beta
          </span>
        )}
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <div className="flex items-center gap-3 group">
          <Lock className="w-4 h-4 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            Non-custodial
          </span>
        </div>
        
        <div className="flex items-center gap-3 group">
          <Eye className="w-4 h-4 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            Transparent fees
          </span>
        </div>

        <div className="flex items-center gap-3 group">
          <CheckCircle className="w-4 h-4 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            Rate guaranteed
          </span>
        </div>

        <div className="flex items-center gap-3 group">
          <Shield className="w-4 h-4 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            Audited
          </span>
        </div>
      </div>
    </div>
  )
>>>>>>> 941ae72
}
