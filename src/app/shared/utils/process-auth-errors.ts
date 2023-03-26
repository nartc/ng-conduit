export function processAuthErrors(errors: Record<string, string[]>): {
    errors: string[];
    hasError: boolean;
} {
    const errorEntries = Object.entries(errors);
    return {
        errors: errorEntries.reduce((authErrors, curr) => {
            authErrors.push(...curr[1].map((error) => `${curr[0]} ${error}`));
            return authErrors;
        }, [] as string[]),
        hasError: errorEntries.length > 0,
    };
}
