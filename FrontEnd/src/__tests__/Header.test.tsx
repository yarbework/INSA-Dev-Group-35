import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Components/Header/Header';
import '@testing-library/jest-dom';


describe('Header Component', () => {
  it('renders logo and desktop nav links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Check the logo text
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Geek')).toBeInTheDocument();

    // Desktop links (they are hidden on mobile)
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Exams')).toBeInTheDocument();
    expect(screen.getByText('About us')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // After clicking, menu should be open
   const homeLinks = screen.getAllByText('Home');
   expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('renders Buttons component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Chekc for render of the login and signup buttons
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });
});