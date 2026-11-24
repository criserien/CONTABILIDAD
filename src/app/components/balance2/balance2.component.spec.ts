/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Balance2Component } from './balance2.component';

describe('Balance2Component', () => {
  let component: Balance2Component;
  let fixture: ComponentFixture<Balance2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Balance2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Balance2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
