import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full relative bg-Background-Base overflow-hidden">
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        src="/background.jpg"
        alt="Background"
        fill
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full p-4 md:p-8 lg:p-12">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Image
                src="/logo.svg"
                alt="Agristato Logo"
                width={50}
                height={50}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            </div>
            <div className="text-green-700 text-xl md:text-2xl lg:text-4xl font-bold logo">
              Agristato
            </div>
          </div>
        </header>

        <main className="flex-1 flex justify-center px-4 py-8">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-domine text-green-700 mb-6">
              Política de Privacidade
            </h1>

            <div className="space-y-6 text-gray-700 font-outfit">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}
              </p>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">1. Informações Gerais</h2>
                <p>
                  A Agristato (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) respeita a
                  sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política
                  de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                  informações de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº
                  13.709/2018).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">2. Dados Coletados</h2>
                <p className="mb-2">Coletamos as seguintes informações:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Dados de identificação:</strong> Nome, e-mail
                  </li>
                  <li>
                    <strong>Dados sobre a propriedade rural:</strong> Tamanho da fazenda, tipo de
                    cultivo, localização (apenas estado/região)
                  </li>
                  <li>
                    <strong>Dados de uso:</strong> Informações sobre como você utiliza nossa
                    plataforma
                  </li>
                  <li>
                    <strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, dados de acesso
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">
                  3. Finalidade do Tratamento
                </h2>
                <p className="mb-2">Utilizamos seus dados para:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Fornecer acesso à plataforma de análise de solo e nutrientes</li>
                  <li>Melhorar nossos serviços e funcionalidades</li>
                  <li>Comunicar atualizações e novidades sobre o produto</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Garantir a segurança da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">4. Base Legal</h2>
                <p>
                  O tratamento de seus dados pessoais está fundamentado no consentimento livre e
                  específico (Art. 7º, I da LGPD) e no legítimo interesse para melhoria dos nossos
                  serviços (Art. 7º, IX da LGPD).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">
                  5. Compartilhamento de Dados
                </h2>
                <p>
                  Não vendemos, alugamos ou comercializamos seus dados pessoais. Podemos
                  compartilhar informações apenas:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Com prestadores de serviços essenciais (hospedagem, processamento)</li>
                  <li>Para cumprimento de obrigações legais</li>
                  <li>Com seu consentimento expresso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">6. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus
                  dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição,
                  incluindo criptografia, controle de acesso e monitoramento contínuo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">7. Retenção de Dados</h2>
                <p>
                  Seus dados serão mantidos pelo tempo necessário para cumprir as finalidades
                  descritas nesta política, respeitando os prazos legais de retenção e seus direitos
                  como titular dos dados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">8. Seus Direitos</h2>
                <p className="mb-2">De acordo com a LGPD, você tem direito a:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Confirmação da existência de tratamento de dados</li>
                  <li>Acesso aos seus dados pessoais</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">
                  9. Cookies e Tecnologias Similares
                </h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência na
                  plataforma, analisar o uso do site e personalizar conteúdo. Você pode gerenciar
                  suas preferências de cookies nas configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">
                  10. Alterações na Política
                </h2>
                <p>
                  Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos
                  sobre mudanças significativas através do e-mail cadastrado ou por meio de aviso em
                  nossa plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">11. Contato</h2>
                <p className="mb-2">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em
                  contato:
                </p>
                <ul className="space-y-1">
                  <li>
                    <strong>E-mail:</strong> privacidade@agristato.com
                  </li>
                  <li>
                    <strong>Encarregado de Dados (DPO):</strong> dpo@agristato.com
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-black mb-3">
                  12. Autoridade Nacional de Proteção de Dados (ANPD)
                </h2>
                <p>
                  Caso não seja possível resolver sua questão conosco, você pode contatar a ANPD
                  através do canal oficial:{" "}
                  <a href="https://www.gov.br/anpd" className="text-green-700 underline">
                    https://www.gov.br/anpd
                  </a>
                </p>
              </section>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
            >
              ← Voltar ao início
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
