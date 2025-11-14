'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt, FaInfoCircle, FaHome, FaPhone } from 'react-icons/fa';
import { useState } from "react";
import { redirect, useParams,useRouter } from "next/navigation";
import { Endereco } from "../../../../../../types/adress";
import HeadPage from "@/app/(private-access)/components/headPage";
import { FaBookMedical } from "react-icons/fa";
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages";
import { useHistory } from "@/app/context/historyContext";


const Pacientes = () => {
    const { psc } = useParams()
    const [userId, setUserId] = useState<string>(String(psc))
    const [nome, setNome] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')
    const [nick, setNick] = useState<string>('')
    const [idade, setIdade] = useState<string>('')
    const [sintomas, setSintomas] = useState<string>('')
    const [telefone, setTelefone] = useState<string>('')
    const [convenio, setConvenio] = useState<string>('')
    const [sexo, setSexo] = useState('Masculino')
    const [nasc, setNasc] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [rua, setRua] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [pais, setPais] = useState<string>('Brasileira')
    const [complemento, setComplemento] = useState<string>('')
    const [estado, setEstado] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [rg, setRg] = useState<string>(String(''))
    const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
    const router=  useRouter()

    const {logAction} =  useHistory()

   
    const resetForm = () => {
        setNome('');
        setCpf('');
        setNick('');
        setIdade('');
        setSintomas('');
        setTelefone('');
        setConvenio('');
        setSexo('Masculino'); // Se for necessário resetar para um valor padrão
        setNasc('');
        setCep('');
        setCity('');
        setBairro('');
        setRua('');
        setNumero('');
        setPais('Brasileira'); // Se for necessário resetar para um valor padrão
        setComplemento('');
        setEstado('');
        setEmail('');
        setRg('');

    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const novoPaciente = {
            nome,
            fantasy_name: nick,
            idade,
            sintomas,
            telefone,
            convenio,
            sexo,
            cep,
            cidade: city,
            bairro,
            rua,
            numero,
            pais,
            complemento: complemento || "sem complemento",
            estado,
            email,
            rg,
            cpf,
            psicologoId: userId,
            resumo_anmp: 'sem dados'
        };

        try {
            const response = await fetch("/api/internal/register_pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoPaciente),
            });

            const data = await response.json();

            if (response.ok) {
                showSuccessMessage("Paciente cadastrado com sucesso!");
                logAction(`Você cadastrou ${novoPaciente.nome} em sua base de paciente `, novoPaciente.psicologoId);
                resetForm();
                router.push(`/meus-pacientes/${psc}`);
            } else {
                showErrorMessage(data.error || "Erro ao cadastrar paciente.");
            }
        } catch (error) {
            showErrorMessage("Erro ao cadastrar paciente. " + (error instanceof Error ? error.message : ""));
        }
    };


    /**
   * Valida um CPF.
   *
   * @param cpf - O CPF a ser validado (pode ser formatado ou não).
   * @returns Retorna `true` se o CPF for válido, caso contrário `false`.
   */
    function validarCPF(cpf: string): boolean {
        const cleanedCPF = cpf.replace(/\D/g, '');
        if (cleanedCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanedCPF)) {
            return false;
        }
        const calcularDigito = (limit: number): number => {
            let total = 0;
            for (let i = 0; i < limit; i++) {
                total += parseInt(cleanedCPF[i]) * (limit + 1 - i);
            }
            const resto = total % 11;
            return resto < 2 ? 0 : 11 - resto;
        };
        const digito1 = calcularDigito(9);
        const digito2 = calcularDigito(10);
        const isValid = digito1 === parseInt(cleanedCPF[9]) && digito2 === parseInt(cleanedCPF[10]);
        return isValid;
    }


    /**  Função determina a seleção de sexo do usuário no check box 
    * @param e:Event - tipagem do evento especifo para checkbox
    */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSexo(e.target.value);
    };


    /**
     * Essa função calcula a idade atraves do data de nascimento passada pelo usuario
     * @return void
     *  */
    const calcularIdade = () => {
        if (!nasc) {
          console.error("Data de nascimento não fornecida.");
          return;
        }
      
        const [ano, mes, dia] = nasc.split("-").map(Number); // formato yyyy-mm-dd
        const dataNascimento = new Date(ano, mes - 1, dia);
        const dataAtual = new Date();
      
        let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
      
        const mesAtual = dataAtual.getMonth();
        const diaAtual = dataAtual.getDate();
      
        if (mesAtual < mes - 1 || (mesAtual === mes - 1 && diaAtual < dia)) {
          idade--;
        }
      
        setIdade(String(idade));
      };
      

    /**
     * Função que faz o fetch para pegar o endereço quando o usuário digita o CEP.
     * @param cep O CEP que será utilizado para buscar o endereço.
     */
    const buscaEndereco = async (cep: string) => {
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!res.ok) {
                showErrorMessage('Endereço não encontrado! Verifique o CEP e tente novamente.')
                throw new Error('Erro ao buscar o endereço');

            }
            const data: Endereco = await res.json();
            setBairro(data.bairro)
            setCity(data.localidade)
            setRua(data.logradouro)
            setEstado(data.estado)
            setCep(data.cep)
            return data;
        } catch (error) {
            showErrorMessage(`Erro ao buscar o endereço`)
          
        }
    };


    


    return (
        <>
            <HeadPage title='Pacientes' icon={<FaBookMedical size={20} />} />

            {/* Verificação do Role aqui vai mudar para role=== 'PSYCHOLOGIST'*/}
            {role === 'PSYCHOLOGIST' ? (
                <form onSubmit={handleSubmit}>
                    <div className=" relative w-full max-w-screen-xl h-auto ml-[10%] bg-[#2c3232] p-5">
                        {/* Header */}
                        <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
                            <FaCalendarAlt className="text-black text-2xl mr-4" />
                            <h1 className=" font-extrabold text-2xl text-black">Novo Paciente</h1>
                        </div>
                        {/* Informações Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaInfoCircle className="text-black text-xl mr-4" />
                                <h2 className=" font-semibold text-lg">Informações</h2>
                            </div>
                            <hr className="border-t border-[#0b0404] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Psicologo */}
                                <div>
                                    <label className="block text-sm mb-1">Psicologo:</label>
                                    <input
                                        type="text"
                                        value={userId}
                                        className="w-full text-black h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        disabled
                                        readOnly
                                    />
                                </div>
                                {/* CPF */}
                                <div>
                                    <label className="block  text-sm mb-1">CPF:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        onBlur={() => validarCPF(cpf)}
                                        required
                                    />
                                </div>
                                {/* RG */}
                                <div>
                                    <label className="block  text-sm mb-1">RG:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={rg}
                                        onChange={(e) => setRg(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* Nome e Nome fantasia */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block  text-sm mb-1">Nome:</label>
                                        <input
                                            type="text"
                                            className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block  text-sm mb-1">Nome fantasia:</label>
                                        <input
                                            type="text"
                                            className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                            value={nick}
                                            onChange={(e) => setNick(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Sexo */}
                                <div className="col-span-2 text-black lg:col-span-3 bg-slate-200 p-4 rounded-sm">
                                    <label className="block  text-sm mb-2">Sexo:</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="masculino"
                                                className="accent-blue-500"
                                                onChange={handleChange}
                                            />
                                            Masculino
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="feminino"
                                                className="accent-pink-500"
                                                onChange={handleChange}
                                            />
                                            Feminino
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="nao_informar"
                                                className="accent-gray-500"
                                                onChange={handleChange}
                                            />
                                            Prefiro não informar
                                        </label>
                                    </div>
                                </div>
                                {/* Convenio */}
                                <div>
                                    <label className="block  text-sm mb-1">Convenio:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={convenio}
                                        onChange={(e) => setConvenio(e.target.value)}
                                    />
                                </div>
                                {/* Data de nascimento */}
                                <div>
                                    <label className="block  text-sm mb-1">Data de Nascimento:</label>
                                    <input
                                        type="date"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={nasc}
                                        onChange={(e) => {
                                            setNasc(e.target.value)
                                           
                                        }}

                                        onBlur={()=>{calcularIdade()}}
                                      
                                        required
                                    />
                                </div>
                                {/* Naturalidade */}
                                <div>
                                    <label className="block  text-sm mb-1">Naturalidade:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={pais}
                                        onChange={(e) => setPais(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Endereço Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaHome className=" text-xl mr-4" />
                                <h2 className=" font-semibold text-lg">Endereço</h2>
                            </div>
                            <hr className="border-t border-[#D9D9D9] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block  text-sm mb-1">CEP:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        onBlur={(e) => { buscaEndereco(cep) }}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block  text-sm mb-1">Rua:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={rua}
                                        onChange={(e) => setRua(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block  text-sm mb-1">Estado:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block  text-sm mb-1">Bairro:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block  text-sm mb-1">Cidade:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block  text-sm mb-1">Número:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Telefone*/}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaPhone className=" text-xl mr-4" />
                                <h2 className=" font-semibold text-lg">Contatos</h2>
                            </div>
                            <hr className="border-t border-[#D9D9D9] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block  text-sm mb-1">E-mail:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block  text-sm mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block  text-sm mb-1">Descrever o motivo da consulta</label>
                                <textarea
                                    className="w-full h-[120px] text-black bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                    onChange={(e) => setSintomas(e.target.value)}
                                    value={sintomas}
                                />
                            </div>
                            {/* Bottom Section */}
                            <div className="flex justify-between items-center mt-8">
                                <input 
                                type='button'
                                    className="bg-blue-500 text-white px-6 py-3 rounded-md"
                                    onClick={()=>{redirect(`/meus-pacientes/${psc}`)}}
                                    value={'Cancelar'}
                               / >
                                   
                             
                                <input type='submit'
                                    className="bg-green-500 text-white px-6 py-3 rounded-md"
                                    value='Salvar'
                                />
                            </div>
                        </div>
                    </div>
                </form>
            ) : (<>
                <div>
                    <h2>Sem autorização para ver essa pagina</h2>
                </div>
            </>)}
        </>
    )
}

export default Pacientes;