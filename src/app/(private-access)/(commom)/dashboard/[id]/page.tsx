'use client'

import { useAccessControl } from "@/app/context/AcessControl"
import { MdOutlineDashboard } from "react-icons/md"
import HeadPage from "@/app/(private-access)/components/headPage"
import { FaUsers, FaCalendarAlt, FaChartPie, FaBrain, FaHeartbeat, FaSmile } from "react-icons/fa"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const Dashboard = () => {
  const { role } = useAccessControl()

  const Card = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
    <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg w-full bg-[#1D3330]`}>
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-[#E6FAF6]/70 uppercase">{title}</p>
        <p className="text-xl font-bold text-[#E6FAF6]">{value}</p>
      </div>
    </div>
  )

  const sampleBarData = [
    { name: 'Seg', sessões: 5 },
    { name: 'Ter', sessões: 8 },
    { name: 'Qua', sessões: 6 },
    { name: 'Qui', sessões: 7 },
    { name: 'Sex', sessões: 4 },
  ]

  const samplePieData = [
    { name: 'Ansiedade', value: 400 },
    { name: 'Depressão', value: 300 },
    { name: 'Relacionamentos', value: 200 },
    { name: 'Autoestima', value: 100 },
  ]

  const COLORS = ['#55FF00', '#FF8042', '#3D975B', '#FFBB28']

  const ChartSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-[#0F1113] p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#E6FAF6] mb-4">Sessões por dia</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleBarData}>
            <CartesianGrid stroke="#33564F" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#E6FAF6" />
            <YAxis stroke="#E6FAF6" />
            <Tooltip contentStyle={{ backgroundColor: '#1D3330', borderRadius: 8, borderColor: '#33564F', color: '#E6FAF6' }} />
            <Bar dataKey="sessões" fill="#55FF00" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-[#0F1113] p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#E6FAF6] mb-4">Motivos de atendimento</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={samplePieData} dataKey="value" outerRadius={80} label>
              {samplePieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1D3330', borderRadius: 8, borderColor: '#33564F', color: '#E6FAF6' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const psychologistDashboard = (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Atendimentos realizados" value="32" icon={<FaCalendarAlt />} color="text-[#55FF00]" />
        <Card title="Pacientes ativos" value="14" icon={<FaUsers />} color="text-[#3D975B]" />
        <Card title="Média semanal" value="6.5" icon={<FaChartPie />} color="text-[#FFBB28]" />
        <Card title="Sessões emocionais" value="18" icon={<FaBrain />} color="text-[#FF8042]" />
        <Card title="Sessões com melhora" value="12" icon={<FaHeartbeat />} color="text-[#FF3366]" />
        <Card title="Feedbacks positivos" value="92%" icon={<FaSmile />} color="text-[#55FFCC]" />
      </div>
      <ChartSection />
    </div>
  )

  const adminDashboard = (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Psicólogos cadastrados" value="56" icon={<FaUsers />} color="text-[#55FF00]" />
        <Card title="Atendimentos totais" value="1.204" icon={<FaCalendarAlt />} color="text-[#FF3366]" />
        <Card title="Taxa de atividade" value="87%" icon={<FaChartPie />} color="text-[#FFBB28]" />
        <Card title="Consultas em andamento" value="22" icon={<FaBrain />} color="text-[#3D975B]" />
        <Card title="Retornos marcados" value="38" icon={<FaCalendarAlt />} color="text-[#FF8042]" />
        <Card title="Usuários na plataforma" value="245" icon={<FaUsers />} color="text-[#55FFCC]" />
      </div>
      <ChartSection />
    </div>
  )

  return (
    <>
      {role === 'PSYCHOLOGIST' ? (
        <>
          <HeadPage title="Dashboard do Psicólogo" icon={<MdOutlineDashboard size={20} />} />
          {psychologistDashboard}
        </>
      ) : role === 'ADMIN' ? (
        <>
          <HeadPage title="Dashboard Administrativo" icon={<MdOutlineDashboard size={20} />} />
          {adminDashboard}
        </>
      ) : (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Acesso não autorizado
        </div>
      )}
    </>
  )
}

export default Dashboard
