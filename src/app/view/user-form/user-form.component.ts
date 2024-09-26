// src/app/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user.dto';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
    userForm: UntypedFormGroup;
    isEditMode = false;
    userId: number | null = null;
    hide = true;

    constructor(
        private fb: UntypedFormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.userForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        birthdate: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        profile: ['', Validators.required],
        password: ['']
        });
    }

    ngOnInit(): void {
        const state = history.state;
        if (state && state.user) {
            console.log(state)
            this.isEditMode = true;
            this.userId = state.user.id;
            this.userForm.patchValue(state.user);

            const adjustedProfile = this.mapRoleToProfile(state.user.profile);
            this.userForm.get('profile')?.setValue(adjustedProfile);

            this.userForm.get('username')?.disable();
        }
    }

    private mapRoleToProfile(role: string): string {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'ADMIN';
            case 'ROLE_USER':
                return 'USER';
            default:
                return role;
        }
    }

    formatPhone(event: any): void {
        let input = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        if (input.length > 0) {
            input = `+${input}`;
        }
        if (input.length > 3) {
            input = `${input.substring(0, 3)} (${input.substring(3)}`;
        }
        if (input.length > 7) {
            input = `${input.substring(0, 7)}) ${input.substring(7)}`;
        }
        if (input.length > 13) {
            input = `${input.substring(0, 14)} ${input.substring(14)}`;
        }
        if (input.length > 17) {
            input = `${input.substring(0, 17)} ${input.substring(17, 21)}`;
        }
        event.target.value = input.substring(0, 20);
    }

    onSubmit(): void {
        const user: UserDTO = this.userForm.value;

        user.birthdate = new Date(user.birthdate).toISOString().split('T')[0];

        if (this.isEditMode && this.userId !== null) {
            this.userService.editUser({ ...user, id: this.userId }).subscribe(() => {
                    console.log('Usuário atualizado com sucesso');
                    this.router.navigate(['/home']);
                },(error: any) => {
                    console.error('Erro ao editar usuário:', error)
                    this.handleError(error);
                });
        } else {
            this.userService.createUser(user).subscribe(
                () => {
                    console.log('Usuário cadastrado com sucesso');
                    this.router.navigate(['/home']);
                }, (error: any) => {
                    console.error('Erro ao cadastrar usuário:', error)
                    this.handleError(error);
                }
            );
        }
    }

    private handleError(error: any): void {
        console.error('Erro ao processar a solicitação:', error.error);
        if (error.status === 400) {
            alert('Erro de validação: Verifique os campos e tente novamente.');
        } else if (error.status === 404) {
            alert('Recurso não encontrado.');
        } else if (error.status === 500) {
            alert('Erro no servidor. Por favor, tente novamente mais tarde.');
        } else if (error.status === 409){
            if (error.error?.username) {
                alert(error.error.username)
            } else if (error.error?.email) {
                alert(error.error.email)
            } else if (error.error?.phone) {
                alert(error.error.phone)
            } else {
                alert('Erro no servidor. Por favor, tente novamente mais tarde.')
            }
        }
        else {
            alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
    }

    onCancel(): void {
        this.router.navigate(['/home']);
    }
}
