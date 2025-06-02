
export default function AppFooter() {
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Antartican Co. Eats. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Fresh from the South Pole, to your door!
        </p>
      </div>
    </footer>
  );
}
