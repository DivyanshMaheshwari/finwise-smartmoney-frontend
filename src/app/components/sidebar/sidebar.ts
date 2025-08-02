import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true, //
  imports: [CommonModule, RouterLink, RouterLinkWithHref],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  isCollapsed = true;

  //   @Output() collapsedChange = new EventEmitter<boolean>();

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // this.collapsedChange.emit(this.isCollapsed);
  }
}
