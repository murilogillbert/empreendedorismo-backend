import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../services/dbService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
/**
 * Controller for Authentication operations.
 */
export class AuthController {
    /**
     * Register a new user.
     */
    static async register(req, res, next) {
        try {
            const { fullName, email, phone, password } = req.body;
            // Check if user already exists
            const existingUserResult = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
            if (existingUserResult.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }
            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);
            // Create user
            const newUserResult = await db.query('INSERT INTO usuarios (nome_completo, email, telefone, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id_usuario as id, email', [fullName, email, phone, passwordHash]);
            const user = newUserResult.rows[0];
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Login user and return JWT.
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            // Find user with roles
            const userResult = await db.query(`SELECT u.id_usuario as id, u.email, u.senha_hash as "passwordHash", u.nome_completo as "fullName",
                        COALESCE(
                            json_agg(p.nome) FILTER (WHERE p.nome IS NOT NULL),
                            '[]'
                        ) as roles
                 FROM usuarios u
                 LEFT JOIN usuarios_papeis up ON u.id_usuario = up.id_usuario
                 LEFT JOIN papeis p ON up.id_papel = p.id_papel
                 WHERE u.email = $1
                 GROUP BY u.id_usuario`, [email]);
            const user = userResult.rows[0];
            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            // Generate JWT
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                roles: user.roles
            }, JWT_SECRET, { expiresIn: '1d' });
            res.json({
                success: true,
                token,
                data: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    roles: user.roles,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=authController.js.map