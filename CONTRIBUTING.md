# Contributing to NextPay

Thank you for your interest in contributing to NextPay! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/sachinkr7368/nextpay/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear feature description
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant examples

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/sachinkr7368/nextpay.git
   cd nextpay
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Add tests**
   - Write unit tests for new features
   - Ensure all tests pass
   - Maintain or improve code coverage

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commits:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting, missing semicolons, etc.
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

6. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then open a Pull Request on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Test results

## Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment**

   ```bash
   cp apps/web/.env.example apps/web/.env
   cp apps/api/.env.example apps/api/.env
   # Update with your values
   ```

3. **Start development servers**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type
- Use meaningful variable names

### React/Next.js

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic into custom hooks

### NestJS

- Follow NestJS best practices
- Use dependency injection
- Create DTOs for validation
- Use guards for authorization

### General

- Follow ESLint rules
- Use Prettier for formatting
- Write self-documenting code
- Add JSDoc comments for public APIs

## Testing Guidelines

### Frontend Tests

```typescript
// Component test example
describe('PricingCard', () => {
  it('renders with correct props', () => {
    render(<PricingCard {...props} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })
})
```

### Backend Tests

```typescript
// E2E test example
describe("Auth (e2e)", () => {
  it("should register a new user", () => {
    return request(app.getHttpServer())
      .post("/api/auth/register")
      .send(userData)
      .expect(201);
  });
});
```

## Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation
- Include inline comments for complex logic

## Review Process

1. **Automated Checks**
   - CI/CD pipeline must pass
   - All tests must pass
   - No linting errors
   - Build succeeds

2. **Code Review**
   - Maintainers will review your PR
   - Address feedback and requested changes
   - Keep discussion professional and constructive

3. **Merge**
   - Once approved, maintainers will merge
   - PR will be squashed and merged to main

## Areas for Contribution

### High Priority

- [ ] Additional payment providers
- [ ] Email service integration
- [ ] Two-factor authentication
- [ ] Advanced analytics
- [ ] Multi-language support

### Good First Issues

- [ ] UI improvements
- [ ] Documentation updates
- [ ] Bug fixes
- [ ] Test coverage
- [ ] Accessibility improvements

### Feature Requests

Check the [Issues](https://github.com/sachinkr7368/nextpay/issues) page for requested features.

## Questions?

- Open a [Discussion](https://github.com/sachinkr7368/nextpay/discussions)
- Join our [Discord](https://discord.gg/nextpay)
- Email: contribute@nextpay.com

Thank you for contributing to NextPay! 🎉
