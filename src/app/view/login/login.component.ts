import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: UntypedFormGroup;
    hide = true;

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            this.authService.login(username, password).subscribe({
                next: (response) => {
                    console.log(response)
                    this.authService.setToken(response.token); // Armazena o token no AuthService
                    this.router.navigate(['/users']); // Redireciona para a página principal
                },
                error: (err) => {
                    console.error('Erro de login', err);
                    alert('Falha na autenticação. Verifique suas credenciais.');
                }
            });
        }
    }

    onCancel(): void {
        this.loginForm.reset();
    }
}
