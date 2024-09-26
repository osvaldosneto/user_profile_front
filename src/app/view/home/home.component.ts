import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user.dto';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    
    users: UserDTO[] = [];

    constructor(
        private userService: UserService, 
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadUsers()
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    onEdit(user: UserDTO): void {
        this.router.navigate(['/user-form'], { state: { user } });
    }

    onAddUser(): void {
        this.router.navigate(['/user-form']);
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe(
          (users) => this.users = users.map(({ password, ...user }) => user),
          (error) => console.error('Erro ao carregar usuários:', error)
        );
    }
    
    onDelete(user: UserDTO): void {
        this.userService.deleteUser(user.id).subscribe(
            () => {
              console.log('Usuário deletado com sucesso:', user.id);
              this.loadUsers();
            },
            (error) => console.error('Erro ao deletar usuário:', error)
        );
    }

}
