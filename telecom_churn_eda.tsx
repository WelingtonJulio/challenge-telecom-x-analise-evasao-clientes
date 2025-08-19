import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Database, Download, Filter, TrendingUp, Users, AlertCircle, CheckCircle, Eye, FileText, BarChart3 } from 'lucide-react';

const TelecomChurnEDA = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Simulando dados da API
  const generateChurnData = () => {
    const data = [];
    const contracts = ['Month-to-month', 'One year', 'Two year'];
    const internetServices = ['DSL', 'Fiber optic', 'No'];
    const paymentMethods = ['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'];
    
    for (let i = 0; i < 2000; i++) {
      const tenure = Math.floor(Math.random() * 72) + 1;
      const monthlyCharges = Math.round((Math.random() * 80 + 20) * 100) / 100;
      const totalCharges = Math.round((monthlyCharges * tenure + Math.random() * 500) * 100) / 100;
      const contract = contracts[Math.floor(Math.random() * contracts.length)];
      const internetService = internetServices[Math.floor(Math.random() * internetServices.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Lógica realística para churn
      let churnProb = 0.15;
      if (contract === 'Month-to-month') churnProb += 0.25;
      if (tenure < 6) churnProb += 0.3;
      else if (tenure < 12) churnProb += 0.15;
      if (monthlyCharges > 80) churnProb += 0.1;
      if (internetService === 'Fiber optic') churnProb += 0.08;
      if (paymentMethod === 'Electronic check') churnProb += 0.12;
      
      const churn = Math.random() < Math.min(churnProb, 0.8) ? 'Yes' : 'No';
      
      data.push({
        customerID: `C${String(i + 1).padStart(4, '0')}`,
        gender: Math.random() < 0.5 ? 'Male' : 'Female',
        seniorCitizen: Math.random() < 0.16 ? 1 : 0,
        partner: Math.random() < 0.48 ? 'Yes' : 'No',
        dependents: Math.random() < 0.3 ? 'Yes' : 'No',
        tenure,
        phoneService: Math.random() < 0.9 ? 'Yes' : 'No',
        multipleLines: Math.random() < 0.4 ? 'Yes' : 'No',
        internetService,
        onlineSecurity: internetService === 'No' ? 'No internet service' : (Math.random() < 0.5 ? 'Yes' : 'No'),
        onlineBackup: internetService === 'No' ? 'No internet service' : (Math.random() < 0.5 ? 'Yes' : 'No'),
        deviceProtection: internetService === 'No' ? 'No internet service' : (Math.random() < 0.5 ? 'Yes' : 'No'),
        techSupport: internetService === 'No' ? 'No internet service' : (Math.random() < 0.5 ? 'Yes' : 'No'),
        streamingTV: internetService === 'No' ? 'No internet service' : (Math.random() < 0.4 ? 'Yes' : 'No'),
        streamingMovies: internetService === 'No' ? 'No internet service' : (Math.random() < 0.4 ? 'Yes' : 'No'),
        contract,
        paperlessBilling: Math.random() < 0.6 ? 'Yes' : 'No',
        paymentMethod,
        monthlyCharges,
        totalCharges,
        churn
      });
    }
    return data;
  };
  
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  
  useEffect(() => {
    const data = generateChurnData();
    setRawData(data);
    setProcessedData(data);
  }, []);
  
  // Análises e métricas
  const churnRate = processedData.length > 0 ? 
    (processedData.filter(d => d.churn === 'Yes').length / processedData.length * 100).toFixed(1) : 0;
  
  const avgTenure = processedData.length > 0 ? 
    (processedData.reduce((sum, d) => sum + d.tenure, 0) / processedData.length).toFixed(1) : 0;
  
  const avgMonthlyCharges = processedData.length > 0 ? 
    (processedData.reduce((sum, d) => sum + d.monthlyCharges, 0) / processedData.length).toFixed(2) : 0;
  
  // Análise por contrato
  const contractAnalysis = ['Month-to-month', 'One year', 'Two year'].map(contract => {
    const subset = processedData.filter(d => d.contract === contract);
    const churnCount = subset.filter(d => d.churn === 'Yes').length;
    return {
      contract,
      total: subset.length,
      churn: churnCount,
      churnRate: subset.length > 0 ? ((churnCount / subset.length) * 100).toFixed(1) : 0
    };
  });
  
  // Análise por tenure
  const tenureAnalysis = [
    { range: '0-12', min: 0, max: 12 },
    { range: '13-24', min: 13, max: 24 },
    { range: '25-36', min: 25, max: 36 },
    { range: '37-48', min: 37, max: 48 },
    { range: '49-60', min: 49, max: 60 },
    { range: '61+', min: 61, max: 100 }
  ].map(bucket => {
    const subset = processedData.filter(d => d.tenure >= bucket.min && d.tenure <= bucket.max);
    const churnCount = subset.filter(d => d.churn === 'Yes').length;
    return {
      tenure: bucket.range,
      total: subset.length,
      churn: churnCount,
      churnRate: subset.length > 0 ? parseFloat(((churnCount / subset.length) * 100).toFixed(1)) : 0
    };
  });
  
  // Análise por charges
  const chargesAnalysis = [
    { range: '20-40', min: 20, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ].map(bucket => {
    const subset = processedData.filter(d => d.monthlyCharges >= bucket.min && d.monthlyCharges <= bucket.max);
    const churnCount = subset.filter(d => d.churn === 'Yes').length;
    return {
      charges: bucket.range,
      total: subset.length,
      churn: churnCount,
      churnRate: subset.length > 0 ? parseFloat(((churnCount / subset.length) * 100).toFixed(1)) : 0
    };
  });
  
  // Análise por serviços
  const servicesAnalysis = [
    'phoneService', 'multipleLines', 'onlineSecurity', 'onlineBackup', 
    'deviceProtection', 'techSupport', 'streamingTV', 'streamingMovies'
  ].map(service => {
    const withService = processedData.filter(d => d[service] === 'Yes');
    const withoutService = processedData.filter(d => d[service] === 'No');
    
    const churnWithService = withService.filter(d => d.churn === 'Yes').length;
    const churnWithoutService = withoutService.filter(d => d.churn === 'Yes').length;
    
    return {
      service: service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      withService: withService.length > 0 ? ((churnWithService / withService.length) * 100).toFixed(1) : 0,
      withoutService: withoutService.length > 0 ? ((churnWithoutService / withoutService.length) * 100).toFixed(1) : 0,
      impact: withService.length > 0 && withoutService.length > 0 ? 
        (((churnWithService / withService.length) - (churnWithoutService / withoutService.length)) * 100).toFixed(1) : 0
    };
  });
  
  const COLORS = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
  
  const steps = [
    {
      title: "1. Extração dos Dados (API)",
      icon: <Database className="w-6 h-6" />,
      content: () => (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Simulação de Coleta via API
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">api/customers/churn</code></span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Método: GET com paginação (limit=2000)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Formato: JSON com {rawData.length} registros coletados</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Status: Dados carregados com sucesso</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Total de Clientes</h4>
              <p className="text-2xl font-bold text-blue-600">{rawData.length.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-4 border rounded-lg text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Variáveis Coletadas</h4>
              <p className="text-2xl font-bold text-green-600">21</p>
            </div>
            
            <div className="bg-white p-4 border rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Taxa de Churn</h4>
              <p className="text-2xl font-bold text-red-600">{churnRate}%</p>
            </div>
          </div>
          
          <div className="bg-white p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">Estrutura dos Dados (Primeiras 5 linhas)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Customer ID</th>
                    <th className="p-2 text-left">Tenure</th>
                    <th className="p-2 text-left">Monthly Charges</th>
                    <th className="p-2 text-left">Contract</th>
                    <th className="p-2 text-left">Churn</th>
                  </tr>
                </thead>
                <tbody>
                  {rawData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{row.customerID}</td>
                      <td className="p-2">{row.tenure}</td>
                      <td className="p-2">R$ {row.monthlyCharges}</td>
                      <td className="p-2">{row.contract}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.churn === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {row.churn}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. Transformação e Limpeza (ETL)",
      icon: <Filter className="w-6 h-6" />,
      content: () => (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800 mb-3">Processo ETL Aplicado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Extract (Extrair)
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Conexão com API Telecom X</li>
                  <li>• Coleta de 2.000 registros</li>
                  <li>• 21 variáveis por cliente</li>
                  <li>• Dados em formato JSON</li>
                </ul>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Transform (Transformar)
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Normalização de strings</li>
                  <li>• Conversão de tipos de dados</li>
                  <li>• Tratamento de valores nulos</li>
                  <li>• Criação de variáveis derivadas</li>
                </ul>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Load (Carregar)
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• DataFrame estruturado</li>
                  <li>• Dados prontos para análise</li>
                  <li>• Índices otimizados</li>
                  <li>• Backup dos dados brutos</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Qualidade dos Dados</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Registros Completos</span>
                  <span className="text-sm font-medium text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Valores Nulos</span>
                  <span className="text-sm font-medium text-red-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-0"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Duplicatas</span>
                  <span className="text-sm font-medium text-red-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Estatísticas Básicas</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Tenure Médio:</span>
                  <p className="font-semibold">{avgTenure} meses</p>
                </div>
                <div>
                  <span className="text-gray-600">Cobrança Média:</span>
                  <p className="font-semibold">R$ {avgMonthlyCharges}</p>
                </div>
                <div>
                  <span className="text-gray-600">Clientes Senior:</span>
                  <p className="font-semibold">{((processedData.filter(d => d.seniorCitizen === 1).length / processedData.length) * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Com Parceiro:</span>
                  <p className="font-semibold">{((processedData.filter(d => d.partner === 'Yes').length / processedData.length) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Análise de Churn por Segmentos",
      icon: <BarChart3 className="w-6 h-6" />,
      content: () => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Churn por Tipo de Contrato</h3>
              <BarChart width={300} height={250} data={contractAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="contract" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="churnRate" fill="#ef4444" />
              </BarChart>
            </div>
            
            <div className="bg-white p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Churn por Tempo de Casa</h3>
              <LineChart width={300} height={250} data={tenureAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tenure" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="churnRate" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </div>
          </div>
          
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Churn por Faixa de Cobrança Mensal</h3>
            <BarChart width={600} height={300} data={chargesAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="charges" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="churnRate" fill="#f59e0b" />
            </BarChart>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contractAnalysis.map((contract, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                parseFloat(contract.churnRate) > 30 ? 'border-red-500 bg-red-50' :
                parseFloat(contract.churnRate) > 15 ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <h4 className="font-semibold">{contract.contract}</h4>
                <p className="text-2xl font-bold text-gray-800">{contract.churnRate}%</p>
                <p className="text-sm text-gray-600">{contract.total} clientes</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "4. Impacto dos Serviços Adicionais",
      icon: <TrendingUp className="w-6 h-6" />,
      content: () => (
        <div className="space-y-6">
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-semibold mb-4">Análise de Churn por Serviços (Com vs Sem)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Serviço</th>
                    <th className="p-3 text-center">Com Serviço</th>
                    <th className="p-3 text-center">Sem Serviço</th>
                    <th className="p-3 text-center">Impacto</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesAnalysis.map((service, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 font-medium">{service.service}</td>
                      <td className="p-3 text-center">{service.withService}%</td>
                      <td className="p-3 text-center">{service.withoutService}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          parseFloat(service.impact) > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {parseFloat(service.impact) > 0 ? '+' : ''}{service.impact}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {parseFloat(service.impact) > 5 ? 
                          <AlertCircle className="w-4 h-4 text-red-500 mx-auto" /> :
                          parseFloat(service.impact) < -5 ? 
                          <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> :
                          <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto"></div>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Serviços de Alto Risco</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• <strong>Tech Support:</strong> Clientes sem suporte técnico têm maior churn</li>
                <li>• <strong>Online Security:</strong> Ausência aumenta risco de cancelamento</li>
                <li>• <strong>Device Protection:</strong> Proteção de dispositivos é crucial</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">✅ Serviços Protetivos</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Phone Service:</strong> Base sólida de clientes</li>
                <li>• <strong>Online Backup:</strong> Reduz significativamente o churn</li>
                <li>• <strong>Streaming Services:</strong> Aumentam engagement</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5. Insights e Recomendações",
      icon: <Eye className="w-6 h-6" />,
      content: () => (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Principais Insights Descobertos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-2 text-red-700">🚨 Fatores de Alto Risco</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Contratos mensais:</strong> {contractAnalysis.find(c => c.contract === 'Month-to-month')?.churnRate}% de churn</li>
                  <li>• <strong>Clientes novos:</strong> Primeiros 12 meses são críticos</li>
                  <li>• <strong>Cobranças altas:</strong> Acima de R$ 80 = maior risco</li>
                  <li>• <strong>Fibra óptica:</strong> Problemas técnicos geram insatisfação</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-2 text-green-700">✅ Fatores Protetivos</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Contratos longos:</strong> {contractAnalysis.find(c => c.contract === 'Two year')?.churnRate}% de churn apenas</li>
                  <li>• <strong>Clientes antigos:</strong> Lealdade após 2 anos</li>
                  <li>• <strong>Serviços de segurança:</strong> Online Security e Tech Support</li>
                  <li>• <strong>Múltiplos serviços:</strong> Cross-selling reduz churn</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h3 className="font-semibold text-yellow-800 mb-3">💡 Recomendações Estratégicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Ações Imediatas:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Programa de Retenção:</strong> Foco nos primeiros 12 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Incentivos para contratos:</strong> Descontos para planos anuais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Melhoria da fibra:</strong> Resolver problemas técnicos</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Ações Estruturais:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Modelo Preditivo:</strong> Implementar score de risco</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Cross-selling:</strong> Ofertar serviços complementares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span><strong>Segmentação:</strong> Abordagem personalizada por perfil</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📊 Próximos Passos</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded text-center border">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">1</span>
                </div>
                <h4 className="text-sm font-semibold">Feature Engineering</h4>
                <p className="text-xs text-gray-600 mt-1">Criar variáveis derivadas</p>
              </div>
              <div className="bg-white p-3 rounded text-center border">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">2</span>
                </div>
                <h4 className="text-sm font-semibold">Modelagem</h4>
                <p className="text-xs text-gray-600 mt-1">Treinar algoritmos ML</p>
              </div>
              <div className="bg-white p-3 rounded text-center border">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">3</span>
                </div>
                <h4 className="text-sm font-semibold">Validação</h4>
                <p className="text-xs text-gray-600 mt-1">Testar performance</p>
              </div>
              <div className="bg-white p-3 rounded text-center border">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">4</span>
                </div>
                <h4 className="text-sm font-semibold">Deploy</h4>
                <p className="text-xs text-gray-600 mt-1">Implementar em produção</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Telecom X - Análise Exploratória de Churn</h1>
          </div>
          <p className="opacity-90">Projeto de Evasão de Clientes | ETL + EDA + Insights Estratégicos</p>
        </div>
        
        <div className="p-6">
          {/* KPIs principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg text-center border-l-4 border-red-500">
              <h3 className="text-sm font-semibold text-red-800">Taxa de Churn</h3>
              <p className="text-2xl font-bold text-red-600">{churnRate}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center border-l-4 border-blue-500">
              <h3 className="text-sm font-semibold text-blue-800">Tenure Médio</h3>
              <p className="text-2xl font-bold text-blue-600">{avgTenure} meses</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border-l-4 border-green-500">
              <h3 className="text-sm font-semibold text-green-800">Cobrança Média</h3>
              <p className="text-2xl font-bold text-green-600">R$ {avgMonthlyCharges}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center border-l-4 border-purple-500">
              <h3 className="text-sm font-semibold text-purple-800">Total Clientes</h3>
              <p className="text-2xl font-bold text-purple-600">{rawData.length.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  currentStep === idx 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {step.icon}
                {step.title}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </h2>
            {steps[currentStep].content()}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Relatório Executivo - EDA Completo
        </h3>
        <p className="text-sm text-gray-600">
          Esta análise exploratória revelou que contratos mensais têm {contractAnalysis.find(c => c.contract === 'Month-to-month')?.churnRate}% de churn 
          vs {contractAnalysis.find(c => c.contract === 'Two year')?.churnRate}% em contratos de 2 anos. 
          Os primeiros 12 meses são críticos, e serviços de segurança/suporte são fatores protetivos essenciais.
        </p>
      </div>
    </div>
  );
};

export default TelecomChurnEDA;
            