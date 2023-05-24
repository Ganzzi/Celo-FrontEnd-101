type Props = {
  className?: string;
};

const navigation = [
  {
    name: "Dacade",
    href: "https://dacade.org/profile",
    icon: (props: Props) => (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="24.000000pt"
        height="24.000000pt"
        viewBox="0 0 130 130"
        {...props}
        preserveAspectRatio="xMidYMid meet">
        <g
          transform="translate(0.000000,130.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none">
          <path
            d="M525 1086 c-129 -41 -227 -126 -283 -245 -31 -64 -37 -88 -40 -163
-5 -97 7 -157 45 -233 78 -157 226 -245 408 -245 251 0 445 195 445 445 0 207
-115 369 -308 434 -71 24 -202 28 -267 7z m199 -57 c75 -66 119 -205 119 -379
0 -175 -44 -313 -120 -381 -35 -30 -39 -31 -108 -27 -144 9 -274 100 -338 236
-30 62 -32 75 -32 172 0 97 2 110 32 172 67 143 207 236 355 237 50 1 62 -3
92 -30z m155 -108 c97 -153 98 -389 2 -540 -17 -26 -41 -57 -53 -67 -21 -19
-21 -19 -13 1 40 99 57 159 67 240 18 147 -1 266 -67 430 -8 20 -8 20 13 1 12
-10 35 -40 51 -65z m85 -4 c110 -135 128 -334 43 -477 -25 -41 -96 -120 -108
-120 -5 0 5 21 22 48 50 79 71 163 71 282 0 120 -21 203 -72 283 -24 38 -26
46 -11 37 11 -5 36 -29 55 -53z"
          />
        </g>
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/Ganzzi",
    icon: (props: Props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-green-400 mt-auto border-black border-t">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-black hover:text-forest"
              target="_blank"
              rel="noopener noreferrer">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-black">
            &copy; {new Date().getFullYear()} Customize with 🖤 by Ganzzi Dacade
            Member.
          </p>
        </div>
      </div>
    </footer>
  );
}
