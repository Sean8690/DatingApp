import { AlertMessage } from './../_models/AlertMessage';
import { AuthService } from './../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Message } from '../_models/Message';

@Injectable()
export class MessagesResolver implements  Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService, private authService: AuthService,
                private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid,
                this.pageNumber, this.pageSize, this.messageContainer)
        .pipe(
            catchError(error => {
               this.alertify.error(AlertMessage.resolverMessageError);
               this.router.navigate(['/home']);
               return of(null);
            })
        );
    }
}
