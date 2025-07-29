export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString();
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getDaysOverdue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime: number = today.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};

interface UserWithName {
  firstName: string;
  lastName: string;
}

interface UserWithFullName extends UserWithName {
  fullName: string;
}

export const formatName = (user: UserWithName): UserWithFullName => {
  return { ...user, fullName: `${user.firstName} ${user.lastName}` };
};
