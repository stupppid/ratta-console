export function validateFileName(fileName, min = 1, max = 64) {
    if(!new RegExp(`^[^@#$!%^&*~\`\?]{${min},${max}}$`).test(fileName)) {
        throw new Error(`file name: Must be between ${min} and ${max} characters long, every character cannot be '@ # $ ! % ^ & * ~ \` ?' `)
    }
}
