/**
 * Skenario E2E Login Forum Diskusi:
 * 1. Pengguna membuka halaman /login dan melihat form login.
 * 2. Pengguna yang belum terdaftar mencoba login dan melihat pesan error.
 * 3. Pengguna mendaftar akun baru dengan email acak, lalu login dan berhasil masuk ke beranda.
 */

describe('Alur Login Aplikasi Forum Diskusi', () => {
  const apiBase = 'https://forum-api.dicoding.dev/v1';

  it('menampilkan form login', () => {
    cy.visit('/login');
    cy.contains('Masuk');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
  });

  it('menampilkan error saat login dengan akun yang salah', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('akun-salah-tidak-ada@mail.com');
    cy.get('input[type="password"]').type('passwordsalah123');
    cy.contains('button', 'Login').click();
    cy.contains('Email atau password salah', { timeout: 15000 }).should('be.visible');
  });

  it('berhasil register lalu login dan masuk beranda', () => {
    const stamp = Date.now();
    const name = `E2E User ${stamp}`;
    const email = `e2e-${stamp}@mail.com`;
    const password = 'secret123';

    cy.request('POST', `${apiBase}/register`, { name, email, password }).then((res) => {
      expect(res.status).to.eq(201);
    });

    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'Login').click();

    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Diskusi Terbaru', { timeout: 15000 }).should('be.visible');
  });
});
