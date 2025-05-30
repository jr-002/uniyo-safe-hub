
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Clock, AlertTriangle, Shield, Zap, Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIncidentAI } from "@/hooks/useIncidentAI";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedReports, setSubmittedReports] = useState([
    {
      id: 1,
      type: "Theft",
      location: "Near Library",
      time: "2 hours ago",
      status: "Under Review",
      anonymous: true
    },
    {
      id: 2,
      type: "Infrastructure",
      location: "Faculty of Engineering",
      time: "1 day ago",
      status: "Resolved",
      anonymous: false
    }
  ]);
  const { toast } = useToast();
  const { isAnalyzing, analysis, analyzeIncident, clearAnalysis } = useIncidentAI();

  const reportTypes = [
    { value: "theft", label: "Theft", icon: "🚨" },
    { value: "harassment", label: "Harassment", icon: "⚠️" },
    { value: "suspicious", label: "Suspicious Activity", icon: "👁️" },
    { value: "infrastructure", label: "Infrastructure Issue", icon: "🔧" },
    { value: "safety", label: "Safety Concern", icon: "🛡️" },
    { value: "other", label: "Other", icon: "📝" }
  ];

  const handleAnalyzeIncident = async () => {
    if (description && location) {
      await analyzeIncident(description, location, reportType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportType && location && description) {
      const newReport = {
        id: submittedReports.length + 1,
        type: reportTypes.find(t => t.value === reportType)?.label || reportType,
        location,
        time: "Just now",
        status: "Submitted",
        anonymous: isAnonymous
      };
      
      setSubmittedReports([newReport, ...submittedReports]);
      
      toast({
        title: "Report Submitted",
        description: `Your ${isAnonymous ? 'anonymous ' : ''}report has been submitted successfully.`,
      });

      // Reset form
      setReportType("");
      setLocation("");
      setDescription("");
      setIsAnonymous(false);
      clearAnalysis();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Reports</h1>
            <p className="text-gray-600">Report safety incidents or infrastructure issues to help keep our campus safe</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Report Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Submit New Report
                </CardTitle>
                <CardDescription>
                  Help keep our campus safe by reporting incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Incident Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Near Faculty of Science, Main Gate"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide details about the incident..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                    <Label htmlFor="anonymous">Submit anonymously</Label>
                  </div>

                  {/* AI Analysis Section */}
                  {description && location && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">AI Analysis</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAnalyzeIncident}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze Report
                            </>
                          )}
                        </Button>
                      </div>

                      {analysis && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(analysis.analysis.priorityLevel)}>
                              {analysis.analysis.priorityLevel.toUpperCase()} Priority
                            </Badge>
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                              Category: {analysis.analysis.suggestedCategory}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Risk Assessment:</h4>
                            <p className="text-sm text-gray-600">{analysis.analysis.riskAssessment}</p>
                          </div>

                          {analysis.analysis.recommendedActions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Recommended Actions:</h4>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {analysis.analysis.recommendedActions.map((action, index) => (
                                  <li key={index}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.analysis.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {analysis.analysis.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Reports
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submittedReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{report.type}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {report.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {report.time}
                        </div>
                      </div>
                      {report.anonymous && (
                        <Badge variant="outline" className="mt-2">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Guidelines */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Reporting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-700">When to Report</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Any suspicious activity on campus</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Theft or attempted theft</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Infrastructure problems affecting safety</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Harassment or intimidation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-red-700">Emergency Situations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>For immediate emergencies, use the SOS feature</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Call security directly: 08012345678</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Reports are for non-emergency situations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
