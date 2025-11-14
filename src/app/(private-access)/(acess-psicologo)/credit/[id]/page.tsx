'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { useRouter, useParams } from "next/navigation"
import { FaRegCreditCard, FaCoins, FaArrowUp, FaArrowDown } from "react-icons/fa"
import HeadPage from "@/app/(private-access)/components/headPage"
import PaymentModal from "./components/modal-recharg"
import { useEffect, useState } from "react"
import Error from "next/error"


const Creditos = () => {
  const { role } = useAccessControl()

  const router = useRouter()

  //determinando  o usuarios
  const params = useParams()
  const id = params.id as string


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [loadingProdutos, setLoadingProdutos] = useState<boolean>(true)
  const [erroProdutos, setErroProdutos] = useState<string | null>(null)
  const [produtosList, setProdutosList] = useState<Produto[]>([])
  const [credito, setCredito] = useState<string>('0')
  const [recarga, setRecarga] = useState<string>('0')
  const [gastos, setGastos] = useState<string>('R$ 0,00')
  // State para armazenar a lista de ordens de compra do usuário
  const [compras, setCompras] = useState<Compra[]>([]);


  //representa meu produto
  interface Produto {
    codigo: string
    titulo: string
    descricao: string
    preco: number
    quantidade: number
  }

  /* primeria parte do fluxo, buscar as ordens salvas no banco */

  //represetna minha compra salva no banco de dados
  interface Compra {
    id: string;
    userId: string;
    user: string;
    paymentId: string;
    Status: string;
    qtdCreditos: string;
  }

  interface ComprasResponse {
    compras: Compra[];
  }




  // Função para buscar as ordens no banco e atribuir ao objeto ordens
  async function fetchOrdens(userId: string) {
    try {
      const res = await fetch(`/api/internal/payments/savepay?userId=${userId}`);
      if (!res.ok) {

        return
      }

      const data: ComprasResponse = await res.json();
      setCompras(data.compras);

      //como peegar os objetos, tem que percorrer as ordens
      console.log(data.compras[0].id); // aqui você verá o array completo
    } catch (error) {
      console.log("Erro ao buscar ordens:", error);
    }
  }

  // Buscar as ordens do usuário quando a página carregar ou quando o id mudar
  useEffect(() => {
    if (id) {
      fetchOrdens(id);
    }
  }, [id]);





  //comprar creditos
  const handleComprar = (produto: Produto) => {

    setIsModalOpen(true)
    setSelectedProduto(produto)

  }


  //recupera o credito do usuario
  async function fetchUserCreditos(userId: string): Promise<number | null> {
    try {
      const res = await fetch(`/api/internal/creditos?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setCredito(data.creditos)
      }
      return null;
    } catch (err) {
      console.error("Erro ao buscar créditos:", err);
      return null;
    }
  }







  //buscar os creditos do usuario quando a pagina carregar
  useEffect(() => {
    fetchUserCreditos(id)
  })






  //listar meus produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoadingProdutos(true)
      setErroProdutos(null)
      try {
        const res = await fetch("/api/internal/products/")
        if (!res.ok) {
          return
        }
        const data = await res.json()
        setProdutosList(data)
        console.log(produtosList)
      } catch (err: any) {
        setErroProdutos(err.message || "Erro ao buscar produtos")
      } finally {
        setLoadingProdutos(false)
      }
    }
    fetchProdutos()
  }, [])



  return (
    <>
      <HeadPage title="Créditos" icon={<FaRegCreditCard size={20} />} />

      {role === 'PSYCHOLOGIST' ? (
        <div className="m-4 bg-[#243129] rounded-2xl shadow-lg p-6">
          {selectedProduto && (
            <>

              <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                produto={selectedProduto}
              />
            </>
          )}

          <h2 className="text-xl font-semibold text-gray-100 mb-4">Resumo de Créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-800">Créditos disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{credito} créditos</p>
              </div>
              <FaCoins size={32} className="text-blue-500" />
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-100">Total recarregado</p>
                <p className="text-2xl font-bold text-green-600">
                  {recarga} créditos
                </p>
              </div>
              <FaArrowUp size={32} className="text-green-500" />
            </div>

            <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total gasto</p>
                <p className="text-2xl font-bold text-red-600">{gastos} créditos</p>
              </div>
              <FaArrowDown size={32} className="text-red-500" />
            </div>
          </div>

          {/* LISTA DE PRODUTOS */}
          <h3 className="text-lg font-semibold text-gray-100 mt-8 mb-4">Escolha um pacote de créditos</h3>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtosList.map((produto) => (
              <div
                key={produto.codigo}
                className="relative bg-[#9a9696] rounded-3xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center p-6 border border-border"
              >
                {/* Título */}
                <h4 className="text-xl font-extrabold text-foreground mb-2">
                  {produto.titulo}
                </h4>

                {/* Quantidade de créditos */}
                <div className="text-secondary font-bold text-2xl mb-2">
                  {produto.quantidade} Créditos
                </div>

                {/* Descrição */}
                <p className="text-muted-foreground text-sm mb-4">
                  {produto.descricao}
                </p>

                {/* Preço */}
                <div className="bg-muted w-full rounded-xl py-3 mb-6">
                  <span className="text-xl font-bold text-black">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>

                {/* Botão Comprar */}
                <button
                  onClick={() => handleComprar(produto)}
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl shadow-md transition duration-200"
                >
                  Comprar
                </button>
              </div>
            ))}
          </div>



        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-gray-600">
          Essa página é acessível apenas para psicólogos.
        </div>
      )}

      {/* Div para apresentar as ordens do usuário */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Minhas Ordens de Compra</h3>
        {/* Aqui você pode mapear e exibir as ordens do usuário */}
        {/* Exemplo estático, troque por dados reais depois */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Nenhuma ordem encontrada.</p>

          {/*   {ordens.map((ordem) => (
          <div key={ordem.id} className="border-b py-2 flex justify-between items-center">
            <span className="font-medium">{ordem.produto}</span>
            <span className={`px-2 py-1 rounded text-xs ${ordem.status === 'PAID' ? 'bg-green-100 text-green-700' : ordem.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {ordem.status}
            </span>
            <span className="text-gray-400">{new Date(ordem.createdAt).toLocaleString()}</span>
          </div>
        ))}
         */}
        </div>
      </div>
    </>
  )
}

export default Creditos
