import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class Topbar implements OnInit {
  @Input() isShifted = false;
  showDropdown = false;
  userInitial = 'U';
  userName = 'User';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    this.userName = `${firstName} ${lastName}`.trim() || 'User';

    // If you want two-letter initials (like "DM" for Divyansh Maheshwari)
    this.userInitial =
      (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
