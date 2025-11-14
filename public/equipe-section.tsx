"use client"

import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"

export default function EquipeSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Nossa Equipe</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Cassio Jordan"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Cassio Jordan</h2>
              <p className="text-tivi-primary mb-4">Engenheiro de Software</p>
              <p className="text-gray-600 mb-4">
                Especialista em desenvolvimento web e arquitetura de sistemas. Responsável pela infraestrutura e
                segurança da plataforma.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Oscar Rodrigues"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Oscar Rodrigues</h2>
              <p className="text-tivi-primary mb-4">Engenheiro de Software</p>
              <p className="text-gray-600 mb-4">
                Especialista em inteligência artificial e processamento de linguagem natural. Responsável pela
                integração das tecnologias de IA.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Tatiane Pontes"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Tatiane Pontes</h2>
              <p className="text-tivi-primary mb-4">Psicóloga</p>
              <p className="text-gray-600 mb-4">
                Idealizadora da solução e especialista em psicologia clínica. Responsável pela validação dos insights e
                abordagens terapêuticas.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-tivi-light p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Nossa Missão</h2>
          <p className="text-gray-700 text-center mb-6">
            Transformar a prática da psicologia através da tecnologia, tornando-a mais eficiente, acessível e baseada em
            evidências, sem jamais perder o toque humano que é essencial para o processo terapêutico.
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                const element = document.getElementById("contato")
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 64,
                    behavior: "smooth",
                  })
                }
              }}
              className="px-6 py-2 bg-tivi-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Junte-se à nossa missão
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
