import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PokemonService, Pokemon } from "./services/pokemon.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("carouselContainer") carousel!: ElementRef<HTMLDivElement>;

  private api = inject(PokemonService);

  pokemons = signal<Pokemon[]>([]);
  loading = signal(false);

  // Configuración
  limit = 5;
  offset = 0;

  searchTerm = "";
  selectedType = "";
  isSearching = false;

  // Carousel Logic
  activeCardIndex = 0;
  private autoPlayInterval: any;

  constructor() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  loadData() {
    this.loading.set(true);
    this.stopAutoPlay(); // Pausar mientras carga

    // Pequeño delay para UX
    setTimeout(() => {
      this.api
        .getPokemons(
          this.limit,
          this.offset,
          this.searchTerm,
          this.selectedType,
        )
        .subscribe({
          next: (data) => {
            this.pokemons.set(data);
            this.loading.set(false);
            this.activeCardIndex = 0;
            // Reiniciar autoplay si hay datos
            setTimeout(() => this.startAutoPlay(), 500);
          },
          error: () => {
            this.pokemons.set([]);
            this.loading.set(false);
          },
        });
    }, 400);
  }

  // --- Lógica del Carousel ---

  startAutoPlay() {
    this.stopAutoPlay(); // Prevenir múltiples intervalos
    this.autoPlayInterval = setInterval(() => {
      this.scrollRight(true); // true = es automático
    }, 3000); // Cambia cada 3 segundos
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  // Detectar scroll manual para actualizar puntitos
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const cardWidth = element.scrollWidth / this.pokemons().length;
    this.activeCardIndex = Math.round(element.scrollLeft / cardWidth);
  }

  scrollLeft() {
    this.stopAutoPlay(); // Si el usuario interactúa, paramos el auto
    if (this.carousel) {
      const container = this.carousel.nativeElement;
      // Si estamos al inicio, vamos al final (Efecto Loop)
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -320, behavior: "smooth" });
      }
    }
    this.startAutoPlay(); // Reiniciar auto
  }

  scrollRight(isAuto = false) {
    if (!isAuto) this.stopAutoPlay();

    if (this.carousel) {
      const container = this.carousel.nativeElement;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Si llegamos al final, volvemos al inicio suavemente
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        this.activeCardIndex = 0;
      } else {
        container.scrollBy({ left: 320, behavior: "smooth" });
      }
    }

    if (!isAuto) this.startAutoPlay();
  }

  scrollToIndex(index: number) {
    this.stopAutoPlay();
    if (this.carousel) {
      const container = this.carousel.nativeElement;
      const cardWidth = 320; // Ancho aproximado de la card + gap
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
    this.startAutoPlay();
  }

  // --- Filtros y Paginación ---

  onLimitChange() {
    this.offset = 0;
    this.loadData();
  }
  onFilterChange() {
    this.offset = 0;
    this.searchTerm = "";
    this.isSearching = !!this.selectedType;
    this.loadData();
  }
  search() {
    if (!this.searchTerm.trim()) return;
    this.isSearching = true;
    this.selectedType = "";
    this.offset = 0;
    this.loadData();
  }
  reset() {
    this.searchTerm = "";
    this.selectedType = "";
    this.isSearching = false;
    this.offset = 0;
    this.loadData();
  }

  changePage(direction: number) {
    if (direction === 1) this.offset += +this.limit;
    else {
      this.offset -= +this.limit;
      if (this.offset < 0) this.offset = 0;
    }
    this.loadData();
  }
}
