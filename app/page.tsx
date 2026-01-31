import { Award, BookOpen, Shield, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/footer'
import { Navbar } from '@/components/ui/navbar'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Aprende sobre Pretratamiento de Agua en Casa
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                YAKU te guía paso a paso en el aprendizaje de técnicas efectivas para el
                pretratamiento de agua a nivel domiciliario.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto dark:text-sky-50" size="lg">
                    Comenzar Ahora
                  </Button>
                </Link>
                <Link href="/dashboard/courses">
                  <Button className="w-full sm:w-auto" size="lg" variant="outline">
                    Explorar Cursos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Técnicas de Pretratamiento de Agua
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sedimentación</h3>
                <p className="text-muted-foreground">
                  Aprende técnicas avanzadas de sedimentación para eliminar partículas suspendidas y
                  mejorar la calidad del agua.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Filtración</h3>
                <p className="text-muted-foreground">
                  Descubre métodos innovadores de filtración incluyendo bioarena, cerámica y
                  sistemas de telas para purificación.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Desinfección</h3>
                <p className="text-muted-foreground">
                  Conoce técnicas efectivas de desinfección como cloro, solar, ultravioleta y
                  métodos de hervido seguro.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Almacenamiento seguro</h3>
                <p className="text-muted-foreground">
                  Aprende a almacenar agua de manera segura y evitar la contaminación.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir YAKU?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contenido Verificado</h3>
                  <p className="text-muted-foreground">
                    Contenido académico recolectado de organizaciones / estudios sobre los métodos
                    de pretratamiento de agua en el hogar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Para la comunidad</h3>
                  <p className="text-muted-foreground">
                    YAKU es una plataforma para la comunidad de aprendizaje gratuita y accesible
                    por medio de la web.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Proyecto educativo</h3>
                  <p className="text-muted-foreground">
                    YAKU es un proyecto educativo que busca informar a la comunidad sobre los
                    métodos de pretratamiento de agua en el hogar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground dark:bg-muted/30 dark:text-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar tu aprendizaje?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Únete a YAKU hoy y aprende los métodos de pretratamiento de agua en el hogar.
            </p>
            <Link href="/signup">
              <Button
                className="bg-background text-foreground hover:bg-background/90"
                size="lg"
                variant="secondary"
              >
                Registrarse Gratis
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
