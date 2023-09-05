/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, HostBinding, Input, OnChanges, OnInit, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, filter, map } from 'rxjs';
import { User } from '@pestras/shared/data-model';
import { PuiIcon, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { UsersState, OrgunitsState, SessionState, StateModule } from '@pestras/frontend/state';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, StateModule, PuiIcon, PuiUtilPipesModule],
  templateUrl: './avatar.widget.html',
  styles: [`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class AvatarWidget implements OnInit, OnChanges {
  user$!: Observable<User | null>;
  orgunit$!: Observable<string>;

  @Input({ required: true })
  serial!: string;
  @Input()
  src: 'users' | 'session' = 'users'
  @Input()
  size?: 'mini' |  'small' | 'large' | 'huge';
  @Input({ transform: booleanAttribute })
  imageOnly = false;

  @HostBinding('class.flex-column')
  @Input({ transform: booleanAttribute })
  vertical = false;

  constructor(
    private readonly session: SessionState,
    private readonly usersState: UsersState,
    private readonly orgunitsState: OrgunitsState
  ) { }

  ngOnChanges(): void {
    this.user$ = this.src === 'session'
      ? this.session.data$
      : this.usersState.select(this.serial);
  }

  ngOnInit(): void {
    this.orgunit$ = this.user$.pipe(
      filter(Boolean),
      switchMap(user => this.orgunitsState.select(user.orgunit)),
      filter(Boolean),
      map(orgunit => orgunit?.name)
    );
  }
}
