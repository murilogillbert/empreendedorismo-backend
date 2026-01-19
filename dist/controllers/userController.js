import db from '../services/dbService.js';
/**
 * Controller for User related operations.
 */
export class UserController {
    /**
     * List all active users.
     */
    static async getAll(req, res, next) {
        try {
            const result = await db.query(`SELECT u.id_usuario as id, u.nome_completo as "fullName", u.email, u.telefone as phone,
                        COALESCE(
                            json_agg(p.nome) FILTER (WHERE p.nome IS NOT NULL),
                            '[]'
                        ) as roles
                 FROM usuarios u
                 LEFT JOIN usuarios_papeis up ON u.id_usuario = up.id_usuario
                 LEFT JOIN papeis p ON up.id_papel = p.id_papel
                 WHERE u.ativo = true
                 GROUP BY u.id_usuario`);
            res.json({ success: true, data: result.rows });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get a specific user by ID.
     */
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await db.query(`SELECT u.id_usuario as id, u.nome_completo as "fullName", u.email, u.telefone as phone,
                        COALESCE(
                            json_agg(p.nome) FILTER (WHERE p.nome IS NOT NULL),
                            '[]'
                        ) as roles
                 FROM usuarios u
                 LEFT JOIN usuarios_papeis up ON u.id_usuario = up.id_usuario
                 LEFT JOIN papeis p ON up.id_papel = p.id_papel
                 WHERE u.id_usuario = $1
                 GROUP BY u.id_usuario`, [Number(id)]);
            const user = result.rows[0];
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=userController.js.map