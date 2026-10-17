export const handleChangeInput = <State extends Record<string, any>>(event: Event, request: State) => {
    const { name, value } = event.target as HTMLInputElement;
    (request as Record<string, any>)[name] = value;
};

export const firstError = (errorFields: Record<string, string[]> | null, field: string): string => {
    return errorFields?.[field]?.[0] ?? ''
}

export const setLoading = (visible: boolean) => {
    document.getElementById("loading")?.toggleAttribute("hidden", !visible)
}

export const setText = (selector: string, text: string) => {
    const element = document.querySelector<HTMLElement>(selector)
    if (element) {
        element.textContent = text
        element.hidden = !text
    }
}
