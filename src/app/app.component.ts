import { AfterContentInit, afterNextRender, AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { PokemonService } from './services/pokemon/pokemon.service';
import { Meta } from '@angular/platform-browser';
import { PageableRequest } from './models/pageable-request.model';
import { Pokemon } from './models/pokemon.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input () id!: string ; 
  
  protected pokemons!: PageableRequest<Pokemon>;
  protected pokemon!: Pokemon;

  protected index = 1;

  constructor(
    protected pokemonService: PokemonService,
    private meta: Meta,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: string
  ) { 
    console.log(this.activatedRoute);
    
    
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get('id'));
    });
    
  }

  ngOnInit(): void {
    console.log(this.id);
    console.log(this.activatedRoute.snapshot.data["id"]);
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get('id'));
    });

    const id = this.activatedRoute.snapshot.params['id'];
    this.getPokemonById(id ?? this.index)
  }

  getPokemonById(id: number) {
    this.pokemonService.getPokemonById(id).subscribe((response) => {
      this.meta.updateTag({ name: 'description', content: response.name });
      this.pokemon = response;
      this.index = id;
    });
  }

  nextPokemon() {
    this.index = this.index + 1;
    this.getPokemonById(this.index);
  }

  prevPokemon() {
    this.index = this.index - 1;
    if (this.index <= 0) this.index = 1;
    this.getPokemonById(this.index);
  }
}
