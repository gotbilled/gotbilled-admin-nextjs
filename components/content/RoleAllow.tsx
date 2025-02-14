interface Role {
  name: string
  access: {
    content: string
    permission: 'read' | 'write'
  }[]
}

const RoleAllow = ({
  role,
  content,
  permission = 'read',
  children
}: {
  role: Role
  content: string
  permission?: 'read' | 'write'
  children: JSX.Element | JSX.Element[]
}) =>
  role.name == 'Admin' ||
  role.access.some(
    (userRole) =>
      userRole.content == content &&
      ['write', permission].includes(userRole.permission)
  ) ? (
    <>{children}</>
  ) : null

export default RoleAllow
