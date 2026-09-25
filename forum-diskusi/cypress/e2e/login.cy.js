/**
 * Skenario E2E Login Forum Diskusi (dengan stub network agar stabil di CI):
 * 1. Pengguna membuka halaman /login dan melihat form login.
 * 2. Pengguna login dengan kredensial salah -> API di-stub 401 -> pesan error tampil.
 * 3. Pengguna login dengan kredensial benar -> API di-stub sukses -> masuk beranda.
 *
 * Catatan: request langsung ke forum-api.dicoding.dev dari runner CI (IP datacenter)
 * sering diblokir AWS WAF (captcha), sehingga spec ini memakai cy.intercept
 * untuk menguji alur login front-end secara deterministik.
 */

describe('Alur Login Aplikasi Forum Diskusi', () => {
  it('menampilkan form login', () => {
    cy.visit('/login');
    cy.contains('Masuk');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
  });

  it('menampilkan error saat login dengan akun yang salah', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { status: 'fail', message: 'Email atau password salah' },
    }).as('loginGagal');

    cy.visit('/login');
    cy.get('input[type="email"]').type('akun-salah-tidak-ada@mail.com');
    cy.get('input[type="password"]').type('passwordsalah123');
    cy.contains('button', 'Login').click();

    cy.wait('@loginGagal');
    cy.contains('Email atau password salah', { timeout: 15000 }).should('be.visible');
  });

  it('berhasil login dan masuk beranda', () => {
    const fakeUser = {
      id: 'user-e2e-1',
      name: 'E2E User',
      email: 'e2e@mail.com',
      avatar: 'https://ui-avatars.com/api/?name=E2E+User&background=random',
    };

    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', data: { token: 'fake-e2e-token' } },
    }).as('loginSukses');
    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: { status: 'success', data: { user: fakeUser } },
    }).as('getMe');
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          threads: [
            {
              id: 'thread-e2e-1',
              title: 'Thread E2E',
              body: 'Isi thread E2E',
              category: 'general',
              createdAt: new Date().toISOString(),
              ownerId: fakeUser.id,
              totalComments: 0,
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      },
    }).as('getThreads');
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', data: { users: [fakeUser] } },
    }).as('getUsers');

    cy.visit('/login');
    cy.get('input[type="email"]').type('e2e@mail.com');
    cy.get('input[type="password"]').type('secret123');
    cy.contains('button', 'Login').click();

    cy.wait('@loginSukses');
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Diskusi Terbaru', { timeout: 15000 }).should('be.visible');
    cy.contains('Thread E2E').should('be.visible');
  });
});
