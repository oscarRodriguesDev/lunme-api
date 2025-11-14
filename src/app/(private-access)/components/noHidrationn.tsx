'use client'
export default function LoadingNoHidration(){
    return(
        <>
        
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600 mb-4">Carregando...</div>
          <div className="animate-spin rounded-full border-t-4 border-blue-600 h-16 w-16 mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Por favor, aguarde enquanto carregamos suas informações.</p>
        </div>
      </div>
        </>
      )
}