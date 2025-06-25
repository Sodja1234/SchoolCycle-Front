import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteStateService {

  // favoritesSubjetct est un BehaviorSubject qui maintient l'état des favoris
  // behaviorSubject est utilisé pour émettre les valeurs actuelles et futures
  private favoritesSubject = new BehaviorSubject<{[key: number]: boolean}>({});

  // Observable public pour que les composants puissent s'abonner aux changements d'état des favoris
  // favorites$ est un Observable qui émet l'état actuel des favoris
  public favorites$ = this.favoritesSubject.asObservable();

  // Met à jour l'état d'un favori
  setFavorite(announcementId: number, isFavorite: boolean): void {
    const current = this.favoritesSubject.value;
    // Met à jour l'état du favori dans l'objet actuel
    this.favoritesSubject.next({...current, [announcementId]: isFavorite});
  }

  // Récupère l'état d'un favori
  // Retourne un Observable qui émet l'état du favori
  isFavorite(announcementId: number): Observable<boolean> {
    // Utilise pipe pour transformer l'Observable des favoris
    // map pour vérifier si l'ID de l'annonce est dans les favoris
    // distinctUntilChanged pour éviter les émissions redondantes
    return this.favorites$.pipe(
      map(favorites => !!favorites[announcementId]),
      distinctUntilChanged()
    );
  }

  // Initialise l'état avec plusieurs favoris
  initializeFavorites(favorites: {[key: number]: boolean}): void {
    this.favoritesSubject.next(favorites);
  }
}
