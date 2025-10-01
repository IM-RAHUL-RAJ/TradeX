import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Instrument } from '../../models/instrument.model';

export interface Price {
  askPrice: number;
  bidPrice: number;
  timestamp: string;
  instrument: Instrument;
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {
  private instrumentsUrl = 'instrument.json';
  private pricesUrl = 'prices.json';

  constructor(private http: HttpClient) {}

  // ✅ Get all instruments
  getInstruments(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(this.instrumentsUrl);
  }

  // ✅ Get all prices
  getPrices(): Observable<Price[]> {
    return this.http.get<Price[]>(this.pricesUrl);
  }

  // ✅ Get instrument with price by ID
  getInstrumentWithPrice(instrumentId: string): Observable<Price | undefined> {
    return this.getPrices().pipe(
      map(prices =>
        prices.find(p => p.instrument.instrumentId === instrumentId)
      )
    );
  }

  // ✅ Get distinct categories from instruments.json
  getCategories(): Observable<{ id: string; name: string }[]> {
    return this.getInstruments().pipe(
      map(instruments => {
        const categories = Array.from(
          new Set(instruments.map(i => i.categoryId))
        );
        return categories.map(c => ({ id: c, name: c }));
      })
    );
  }

  // ✅ Get instruments by category
  getInstrumentsByCategory(categoryId: string): Observable<Instrument[]> {
    return this.getInstruments().pipe(
      map(instruments => instruments.filter(i => i.categoryId === categoryId))
    );
  }

  // ✅ Get prices for multiple instruments
  getPricesForInstruments(ids: string[]): Observable<Price[]> {
    return this.getPrices().pipe(
      map(prices => prices.filter(p => ids.includes(p.instrument.instrumentId)))
    );
  }

  // ✅ Get price for single instrument
  getPriceForInstrument(id: string): Observable<Price | undefined> {
    return this.getPrices().pipe(
      map(prices => prices.find(p => p.instrument.instrumentId === id))
    );
  }

  // ✅ Get all instruments (same as getInstruments)
  getAllInstruments(): Observable<Instrument[]> {
    return this.getInstruments();
  }

  // ✅ Get all prices (same as getPrices)
  getAllPrices(): Observable<Price[]> {
    return this.getPrices();
  }
}
