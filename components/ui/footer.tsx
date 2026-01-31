export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} YAKU. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
