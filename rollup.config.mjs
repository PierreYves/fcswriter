import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { fileURLToPath } from 'url';
import path from 'path';
import dts from 'rollup-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.mjs',
                format: 'esm',
            },
            {
                file: 'dist/index.cjs',
                format: 'cjs',
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            alias({
                entries: [
                    { find: '@', replacement: path.resolve(__dirname, 'src') }
                ]
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [
            alias({
                entries: [
                    { find: '@', replacement: path.resolve(__dirname, 'src') }
                ]
            }),
            dts(({ respectExternal: false })),
        ],
    }
];
