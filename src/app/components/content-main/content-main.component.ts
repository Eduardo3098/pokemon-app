import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Pokemon, PokemonService} from '../../services/pokemon.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css']
})
export class ContentMainComponent implements OnInit {

  pokemons: any[] = [];
  pokemonsAux: any[] = [];
  types = ['water', 'fire', 'normal', 'bug', 'poison'];
  actionModal = '';
  formPokemon: FormGroup;
  errorMessage = 'Error al procesar los datos';
  successMessage: string;
  pageActual = 1;

  constructor(private modalService: NgbModal,
              private pokemonService: PokemonService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pokemons = this.getPokeons();
    this.newFormPokemon();
  }

  // abrrir motal
  openModal(modal, action, pokemon) {
    this.actionModal = action;
    if (pokemon !== undefined) {
      this.loadFormPokemon(pokemon);
    } else {
      this.newFormPokemon();
    }
    this.modalService.open(modal, {
      windowClass: 'custom-width-variant-modal',
      size: 'lg'
    });
  }

  // consultar pokemons
  getPokeons(): any {
    this.pokemonService.getPokemons().
    subscribe((data: any) => {
      this.pokemons = data;
      this.pokemonsAux = this.pokemons;
    });
  }

  // guardar o actualizar pokemons
  savePokemon(error): void {
    if (this.formPokemon.invalid) {
      return Object.values(this.formPokemon.controls).forEach(
        (control) => {
          if (control instanceof FormGroup) {
            // tslint:disable-next-line:no-shadowed-variable
            Object.values(control.controls).forEach((control) =>
              control.markAllAsTouched()
            );
          } else {
            control.markAllAsTouched();
          }
        }
      );
    } else {
      const pokemon = new Pokemon;
      pokemon.name = this.formPokemon.value.name;
      pokemon.image = this.formPokemon.value.image;
      pokemon.type = this.formPokemon.value.type;
      pokemon.hp = this.formPokemon.value.hp;
      pokemon.attack = this.formPokemon.value.attack;
      pokemon.defense = this.formPokemon.value.defense;

      if (this.actionModal === 'Nuevo') {
        this.pokemonService.postPokemon(pokemon)
          .subscribe(
            (data: any) => {
              if (data.id !== undefined || data.id !== null) {
                this.pokemons = this.getPokeons();
                this.modalService.dismissAll();
                this.successMessage = 'Proceso ejecutado con éxito';
              } else {
                this.modalService.open(error, {
                  windowClass: 'custom-width-error-modal',
                });
              }
            }
          );
      } else {
        const idPokemon = this.formPokemon.value.id;
        this.pokemonService.updatePokemon(idPokemon, pokemon)
          .subscribe(
            (data: any) => {
              if (data.id !== undefined || data.id !== null) {
                this.pokemons = this.getPokeons();
                this.modalService.dismissAll();
                this.successMessage = 'Proceso ejecutado con éxito';
              } else {
                this.modalService.open(error, {
                  windowClass: 'custom-width-error-modal',
                });
              }
            }
          );
      }
    }
  }

  // borrar pokemons
  deletePokemon(id: number, error): void {
    this.pokemonService.deletePokemon(id)
      .subscribe(
        (data: any) => {
          if (data.id !== undefined || data.id !== null) {
            this.pokemons = this.getPokeons();
            this.successMessage = 'Proceso ejecutado con éxito';
          } else {
            this.modalService.open(error, {
              windowClass: 'custom-width-error-modal',
            });
          }
        }
      );
    this.pokemons = this.getPokeons();
  }

  // manejo de formas

  newFormPokemon() {
    this.formPokemon = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      attack: ['50', [Validators.required]],
      image: ['', [Validators.required]],
      defense: ['50', [Validators.required]],
      type: ['', [Validators.required]],
      hp: ['50', [Validators.required]]
    });
  }

  loadFormPokemon(pokemon) {
    this.formPokemon.reset({
      id: pokemon.id,
      name: pokemon.name,
      attack: pokemon.attack,
      image: pokemon.image,
      defense: pokemon.defense,
      type: pokemon.type,
      hp: pokemon.hp
    });
  }

  // buscador
  search(busqueda: string) {
    this.pokemons = this.pokemonsAux.filter( function(res) {
      console.log(res);
      return res.name.toLowerCase().includes(busqueda.toLowerCase());
    });
  }

  // validaciones
  get nameNoValid() {
    return (
      this.formPokemon.get('name').invalid &&
      this.formPokemon.get('name').touched
    );
  }

  get attackNoValid() {
    return (
      this.formPokemon.get('attack').invalid &&
      this.formPokemon.get('attack').touched
    );
  }

  get imageNoValid() {
    return (
      this.formPokemon.get('image').invalid &&
      this.formPokemon.get('image').touched
    );
  }

  get defenseNoValid() {
    return (
      this.formPokemon.get('defense').invalid &&
      this.formPokemon.get('defense').touched
    );
  }

  get typeNoValid() {
    return (
      this.formPokemon.get('type').invalid &&
      this.formPokemon.get('type').touched
    );
  }

  get hpNoValid() {
    return (
      this.formPokemon.get('hp').invalid &&
      this.formPokemon.get('hp').touched
    );
  }
}
