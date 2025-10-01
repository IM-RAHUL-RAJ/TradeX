import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct company name', () => {
    expect(component.companyName).toBe('TradeX');
  });

  it('should have correct menu items', () => {
    expect(component.menuItems.length).toBeGreaterThan(0);
    expect(component.menuItems).toEqual([
      { label: 'Portfolio', route: '/portfolio' },
      { label: 'Trade', route: '/trade' },
      { label: 'Trade History', route: '/trade-history' },
      { label: 'Reports', route: '/reports' }
    ]);
  });
});
