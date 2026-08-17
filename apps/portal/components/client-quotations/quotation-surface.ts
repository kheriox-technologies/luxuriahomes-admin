/**
 * Which portal surface a quotation view is rendered on.
 *
 * The admin and client views are the same UI over the same data, so rather than
 * forking the components they take a surface and pick their Convex functions
 * from it. The client functions are authorized by email match against the
 * quotation's clients (see `clientPortal/quotations/shared.ts`); the admin ones
 * are `requireAdmin`-gated.
 *
 * The two sets are selected with paired `useQuery(..., 'skip')` calls rather
 * than a lookup table: a union of function references defeats Convex's argument
 * and return-type inference, and the skipped query costs nothing.
 */
export type QuotationSurface = 'admin' | 'client';
