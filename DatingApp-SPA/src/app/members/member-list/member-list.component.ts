import { PaginatedResult } from './../../_models/Pagination';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import {Pagination} from '../../_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
   users: User[];
   user: User = JSON.parse(localStorage.getItem('user'));
   genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
   userParams: any = {};
   pagination: Pagination;

  constructor(private userService: UserService, private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
    });
    this.FiltersDefaultSettings();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilters() {
    this.FiltersDefaultSettings();
    this.loadUsers();
  }

  FiltersDefaultSettings() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.MinAge = 18;
    this.userParams.MaxAge = 99;
    this.userParams.orderBy = 'LastActive';
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
      },
      error => {
          this.alertify.error(error);
      }
    );
  }
}
