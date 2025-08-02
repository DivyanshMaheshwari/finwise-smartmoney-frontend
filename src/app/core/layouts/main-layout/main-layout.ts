import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Topbar } from '../../../components/topbar/topbar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet,Topbar,Sidebar,CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
    //  isSidebarCollapsed = false;

//       toggleSidebar(): void {
//     this.isSidebarCollapsed = !this.isSidebarCollapsed;
//   }

//   handleSidebarToggle(collapsed: boolean) {
//     this.isSidebarCollapsed = collapsed;
//   }
}
