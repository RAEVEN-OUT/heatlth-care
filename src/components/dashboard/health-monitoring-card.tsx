'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Pill, Search, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchWearableData,
  checkDrugInteractions,
  searchMedicalCondition,
  getMedicationInfo,
  calculateHealthRiskScore,
  type WearableData,
  type DrugInteraction,
  type MedicalCondition,
} from '@/lib/healthcare-api';

export function HealthMonitoringCard() {
  const [activeTab, setActiveTab] = useState('wearables');
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [loadingWearables, setLoadingWearables] = useState(false);
  
  // Drug Interactions
  const [medications, setMedications] = useState<string[]>(['aspirin', 'warfarin']);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  
  // Medical Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<MedicalCondition | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  // Medication Info
  const [medQuery, setMedQuery] = useState('');
  const [medInfo, setMedInfo] = useState<any>(null);
  const [loadingMedInfo, setLoadingMedInfo] = useState(false);
  
  // Health Risk
  const [riskScore, setRiskScore] = useState<any>(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  const loadWearableData = async () => {
    setLoadingWearables(true);
    try {
      const data = await fetchWearableData('user-123');
      setWearableData(data);
    } catch (error) {
      console.error('Error loading wearable data:', error);
    }
    setLoadingWearables(false);
  };

  const checkInteractions = async () => {
    setLoadingInteractions(true);
    try {
      const results = await checkDrugInteractions(medications);
      setInteractions(results);
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
    setLoadingInteractions(false);
  };

  const searchCondition = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const result = await searchMedicalCondition(searchQuery);
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching condition:', error);
    }
    setLoadingSearch(false);
  };

  const searchMedication = async () => {
    if (!medQuery.trim()) return;
    setLoadingMedInfo(true);
    try {
      const info = await getMedicationInfo(medQuery);
      setMedInfo(info);
    } catch (error) {
      console.error('Error searching medication:', error);
    }
    setLoadingMedInfo(false);
  };

  const calculateRisk = async () => {
    setLoadingRisk(true);
    try {
      const result = await calculateHealthRiskScore({
        age: 55,
        bloodPressure: { systolic: 145, diastolic: 92 },
        cholesterol: 220,
        bmi: 28,
        smoker: false,
        diabetic: false,
      });
      setRiskScore(result);
    } catch (error) {
      console.error('Error calculating risk:', error);
    }
    setLoadingRisk(false);
  };

  useEffect(() => {
    if (activeTab === 'wearables') {
      loadWearableData();
    } else if (activeTab === 'interactions') {
      checkInteractions();
    } else if (activeTab === 'risk') {
      calculateRisk();
    }
  }, [activeTab]);

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Healthcare Data Integration
        </CardTitle>
        <CardDescription>
          Real-time health monitoring and medical information lookup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="wearables">Wearables</TabsTrigger>
            <TabsTrigger value="interactions">Drug Check</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="medications">Meds Info</TabsTrigger>
            <TabsTrigger value="risk">Risk Score</TabsTrigger>
          </TabsList>

          {/* Wearables Tab */}
          <TabsContent value="wearables" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Live Wearable Data</h3>
              <Button onClick={loadWearableData} disabled={loadingWearables} size="sm">
                {loadingWearables ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
            
            {loadingWearables ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : wearableData ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-2xl font-bold text-red-600">{wearableData.heartRate} <span className="text-sm">bpm</span></p>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <p className="text-sm text-gray-600">Steps</p>
                  <p className="text-2xl font-bold text-blue-600">{wearableData.steps?.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <p className="text-sm text-gray-600">Blood O₂</p>
                  <p className="text-2xl font-bold text-purple-600">{wearableData.bloodOxygen}%</p>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                  <p className="text-sm text-gray-600">Active Minutes</p>
                  <p className="text-2xl font-bold text-green-600">{wearableData.activeMinutes} <span className="text-sm">min</span></p>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-2xl font-bold text-orange-600">{wearableData.calories?.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                  <p className="text-sm text-gray-600">Sleep</p>
                  <p className="text-2xl font-bold text-indigo-600">{Math.floor((wearableData.sleepMinutes || 0) / 60)}h {(wearableData.sleepMinutes || 0) % 60}m</p>
                </div>
              </div>
            ) : null}
            
            <p className="text-xs text-muted-foreground">Last synced: {wearableData?.timestamp ? new Date(wearableData.timestamp).toLocaleString() : 'Never'}</p>
          </TabsContent>

          {/* Drug Interactions Tab */}
          <TabsContent value="interactions" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Check Drug Interactions</h3>
              <p className="text-sm text-muted-foreground mb-4">Currently checking: Aspirin, Warfarin</p>
              <Button onClick={checkInteractions} disabled={loadingInteractions} size="sm">
                {loadingInteractions ? 'Checking...' : 'Check Interactions'}
              </Button>
            </div>
            
            {loadingInteractions ? (
              <Skeleton className="h-32 w-full" />
            ) : interactions.length > 0 ? (
              <div className="space-y-3">
                {interactions.map((interaction, idx) => (
                  <Alert 
                    key={idx}
                    variant={interaction.severity === 'major' ? 'destructive' : 'default'}
                    className={interaction.severity === 'moderate' ? 'border-orange-300 bg-orange-50' : ''}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      {interaction.drug1} + {interaction.drug2}
                      <Badge variant={interaction.severity === 'major' ? 'destructive' : interaction.severity === 'moderate' ? 'default' : 'secondary'}>
                        {interaction.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>{interaction.description}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>No Interactions Found</AlertTitle>
                <AlertDescription>These medications appear to be safe to take together.</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Medical Conditions Tab */}
          <TabsContent value="conditions" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Medical Conditions</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter condition name (e.g., hypertension, diabetes, asthma)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCondition()}
                />
                <Button onClick={searchCondition} disabled={loadingSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {loadingSearch ? (
              <Skeleton className="h-64 w-full" />
            ) : searchResult ? (
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="text-xl font-bold">{searchResult.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{searchResult.description}</p>
                  <Badge className="mt-2">{searchResult.prevalence}</Badge>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Symptoms:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {searchResult.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm">{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Treatments:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {searchResult.treatments.map((treatment, idx) => (
                      <li key={idx} className="text-sm">{treatment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Search for a medical condition to see detailed information</p>
                <p className="text-sm mt-2">Try: hypertension, diabetes, or asthma</p>
              </div>
            )}
          </TabsContent>

          {/* Medications Info Tab */}
          <TabsContent value="medications" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Medication Information</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter medication name (e.g., metformin, lisinopril)"
                  value={medQuery}
                  onChange={(e) => setMedQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMedication()}
                />
                <Button onClick={searchMedication} disabled={loadingMedInfo}>
                  <Pill className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {loadingMedInfo ? (
              <Skeleton className="h-64 w-full" />
            ) : medInfo ? (
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="text-xl font-bold">{medInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">Generic: {medInfo.genericName}</p>
                  <div className="flex gap-2 mt-2">
                    {medInfo.brandNames.map((brand: string, idx: number) => (
                      <Badge key={idx} variant="outline">{brand}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-1">Purpose:</h5>
                  <p className="text-sm">{medInfo.purpose}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Common Side Effects:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {medInfo.commonSideEffects.map((effect: string, idx: number) => (
                      <li key={idx} className="text-sm">{effect}</li>
                    ))}
                  </ul>
                </div>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Serious Side Effects</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {medInfo.seriousSideEffects.map((effect: string, idx: number) => (
                        <li key={idx} className="text-sm">{effect}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h5 className="font-semibold mb-2">Warnings:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {medInfo.warnings.map((warning: string, idx: number) => (
                      <li key={idx} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Search for a medication to see detailed information</p>
                <p className="text-sm mt-2">Try: metformin or lisinopril</p>
              </div>
            )}
          </TabsContent>

          {/* Health Risk Score Tab */}
          <TabsContent value="risk" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Cardiovascular Risk Assessment</h3>
              <Button onClick={calculateRisk} disabled={loadingRisk} size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Recalculate
              </Button>
            </div>
            
            {loadingRisk ? (
              <Skeleton className="h-48 w-full" />
            ) : riskScore ? (
              <div className="space-y-4">
                <div className={`p-6 border-2 rounded-lg text-center ${
                  riskScore.risk === 'low' ? 'bg-green-50 border-green-300' :
                  riskScore.risk === 'moderate' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  <p className="text-sm text-gray-600 mb-2">Risk Score</p>
                  <p className={`text-5xl font-bold ${
                    riskScore.risk === 'low' ? 'text-green-600' :
                    riskScore.risk === 'moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{riskScore.score}</p>
                  <Badge className="mt-3" variant={riskScore.risk === 'high' ? 'destructive' : 'default'}>
                    {riskScore.risk.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Recommendations:</h4>
                  <ul className="space-y-2">
                    {riskScore.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}