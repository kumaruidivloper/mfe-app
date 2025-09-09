import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

declare const window: any;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
    users: any[] = [];
  currentTheme = 'light';
  MessageFromHost: any = null;
  userInfo: any = {};
  loading = false;
  private subscriptions: Subscription[] = [];
  private messageBus: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.messageBus = (window as any).messageBus;
    
    if (this.messageBus) {
      this.setupMessageBusListeners();
      this.loadInitialData();
      this.cdr.detectChanges();
      // Notify host that MFE is loaded
      this.messageBus.emit('MFE_LOADED', {
        component: 'UserManagement',
        version: '1.0.0'
      }, 'mfe');
    } else {
      console.error('MessageBus not available');
    }
  }

  private setupMessageBusListeners() {
    // Listen for host messages
    const hostMessagesSubscription = this.messageBus.on('HOST_MESSAGE').subscribe((event: any) => {
      console.log('Received message from host:', event.payload);
      this.MessageFromHost = event.payload;
      this.cdr.detectChanges();
    });

    // Listen for state changes
    const stateSubscription = this.messageBus.getState().subscribe((state: any) => {
      this.userInfo = state.userInfo || {};
      this.currentTheme = state.theme || 'light';
      this.cdr.detectChanges();
    });

    // Listen for data responses
    const dataResponseSubscription = this.messageBus.on('DATA_RESPONSE').subscribe((event: any) => {
      if (event.payload.requestId === 'user-list') {
        this.users = event.payload.data.users;
        this.loading = false;
        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
    });

    this.subscriptions.push(hostMessagesSubscription, stateSubscription, dataResponseSubscription);
  }

  private loadInitialData() {
    // Get current state
    const currentState = this.messageBus.getCurrentState();
    this.userInfo = currentState.userInfo || {};
    this.currentTheme = currentState.theme || 'light';

    // Request user data from host
    this.requestUserData();
    this.cdr.detectChanges();
  }

  requestUserData() {
    this.loading = false;
    this.messageBus.emit('REQUEST_DATA', {
      requestId: 'user-list',
      type: 'users'
    }, 'mfe');
    this.cdr.detectChanges();
  }

  addUser() {
    const newUser = {
      id: Date.now(),
      name: `New User ${Date.now()}`,
      department: 'New Department'
    };

    this.users.push(newUser);

    // Notify host about user addition
    this.messageBus.emit('USER_ADDED', {
      user: newUser,
      totalUsers: this.users.length
    }, 'mfe');
    this.cdr.detectChanges();
  }

  deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
    
    // Notify host about user deletion
    this.messageBus.emit('USER_DELETED', {
      userId,
      totalUsers: this.users.length
    }, 'mfe');
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
