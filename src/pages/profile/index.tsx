import type { ProDescriptionsActionType } from '@ant-design/pro-components';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { App, Avatar, Badge, Button, Col, Divider, Row, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { getProfileLocale } from '@/locales';
import { useSystemStore, useUserStore } from '@/store';

interface UserProfile {
	username: string;
	email: string;
	department: string;
	position: string;
	joinDate: string;
}

function Profile() {
	const { locale, borderRadius } = useSystemStore();
	const { userInfo } = useUserStore();
	const t = getProfileLocale(locale);
	const { message } = App.useApp();

	const actionRef = useRef<ProDescriptionsActionType>(null);

	// 模拟用户数据
	const [profile, setProfile] = useState<UserProfile>({
		username: userInfo?.username || 'admin',
		email: userInfo?.email || 'admin@example.com',
		department: 'Tech Department',
		position: 'System Administrator',
		joinDate: '2024-01-01',
	});

	// 获取头像 URL，如果没有则使用默认头像
	const avatarUrl = userInfo?.avatar || '/images/default-avatar.jpg';

	return (
		<Space vertical size="large" style={{ width: '100%' }}>
			<Row gutter={[16, 16]}>
				{/* 个人信息卡片 */}
				<Col xs={24} lg={8}>
					<ProCard
						bordered
						style={{
							borderRadius: `${borderRadius}px`,
							textAlign: 'center',
						}}
					>
						<Space vertical size="large" align="center" style={{ width: '100%' }}>
							<Badge
								count={
									<div
										style={{
											width: 24,
											height: 24,
											borderRadius: '50%',
											background: 'var(--ant-color-success)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											border: '2px solid var(--ant-color-bg-container)',
										}}
									>
										<i className="ri-check-line" style={{ color: '#fff', fontSize: 14 }} />
									</div>
								}
								offset={[-10, 90]}
							>
								<Avatar
									size={100}
									src={avatarUrl}
									style={{
										backgroundColor: 'var(--ant-color-primary)',
										fontSize: 36,
									}}
									icon={<i className="ri-user-line" />}
								>
									{!userInfo?.avatar && profile.username.charAt(0).toUpperCase()}
								</Avatar>
							</Badge>

							<div style={{ width: '100%' }}>
								<div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{profile.username}</div>
								<Space vertical size="small" style={{ width: '100%' }}>
									<Tag color="processing" icon={<i className="ri-shield-user-line" />}>
										{profile.position}
									</Tag>
									<div style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 14 }}>
										<i className="ri-building-line mr-1" />
										{profile.department}
									</div>
								</Space>
							</div>

							<Divider style={{ margin: '8px 0' }} />

							<Space vertical size="small" style={{ width: '100%', textAlign: 'left' }}>
								<div className="flex items-center justify-between">
									<span style={{ color: 'var(--ant-color-text-secondary)' }}>
										<i className="ri-mail-line mr-2" />
										{t.basicInfo.email}
									</span>
									<span>{profile.email}</span>
								</div>
								<div className="flex items-center justify-between">
									<span style={{ color: 'var(--ant-color-text-secondary)' }}>
										<i className="ri-calendar-line mr-2" />
										{t.basicInfo.joinDate}
									</span>
									<span>{profile.joinDate}</span>
								</div>
							</Space>
						</Space>
					</ProCard>
				</Col>

				{/* 详细信息卡片 */}
				<Col xs={24} lg={16}>
					<ProCard
						title={
							<Space>
								<i className="ri-user-line" style={{ color: 'var(--ant-color-primary)' }} />
								<span>{t.basicInfo.title}</span>
							</Space>
						}
						bordered
						headerBordered
						style={{ borderRadius: `${borderRadius}px` }}
					>
						<ProDescriptions
							actionRef={actionRef}
							column={{ xs: 1, sm: 2 }}
							editable={{
								onSave: async (_keypath, newInfo) => {
									setProfile({ ...profile, ...newInfo });
									message.success(t.messages.updateSuccess);
									return true;
								},
							}}
							columns={[
								{
									title: t.basicInfo.username,
									dataIndex: 'username',
									formItemProps: {
										rules: [{ required: true, message: t.basicInfo.usernameRequired }],
									},
								},
								{
									title: t.basicInfo.email,
									dataIndex: 'email',
									formItemProps: {
										rules: [
											{ required: true, message: t.basicInfo.emailRequired },
											{ type: 'email', message: t.basicInfo.emailInvalid },
										],
									},
								},
								{
									title: t.basicInfo.department,
									dataIndex: 'department',
									editable: false,
									render: (text) => <Tag color="blue">{text}</Tag>,
								},
								{
									title: t.basicInfo.position,
									dataIndex: 'position',
									editable: false,
									render: (text) => <Tag color="cyan">{text}</Tag>,
								},
								{
									title: t.basicInfo.joinDate,
									dataIndex: 'joinDate',
									valueType: 'date',
									editable: false,
								},
							]}
							dataSource={profile}
						/>
					</ProCard>
				</Col>

				{/* 安全设置卡片 */}
				<Col xs={24}>
					<ProCard
						title={
							<Space>
								<i className="ri-shield-check-line" style={{ color: 'var(--ant-color-warning)' }} />
								<span>{t.security.title}</span>
							</Space>
						}
						bordered
						headerBordered
						style={{ borderRadius: `${borderRadius}px` }}
					>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={12}>
								<ProCard
									hoverable
									bordered
									style={{
										borderRadius: `${borderRadius}px`,
										background: 'var(--ant-color-fill-quaternary)',
									}}
								>
									<Space vertical size="middle" style={{ width: '100%' }}>
										<div className="flex items-center justify-between">
											<Space>
												<div
													style={{
														width: 40,
														height: 40,
														borderRadius: `${borderRadius}px`,
														background: 'var(--ant-color-warning-bg)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<i className="ri-lock-line" style={{ fontSize: 20, color: 'var(--ant-color-warning)' }} />
												</div>
												<div>
													<div style={{ fontWeight: 600, fontSize: 16 }}>{t.security.password}</div>
													<div style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
														{t.security.passwordDescription}
													</div>
												</div>
											</Space>
										</div>
										<Button
											block
											icon={<i className="ri-edit-line" />}
											style={{ borderRadius: `${borderRadius}px` }}
											onClick={() => message.info(t.messages.passwordChangeInDevelopment)}
										>
											{t.security.changePassword}
										</Button>
									</Space>
								</ProCard>
							</Col>

							<Col xs={24} md={12}>
								<ProCard
									hoverable
									bordered
									style={{
										borderRadius: `${borderRadius}px`,
										background: 'var(--ant-color-fill-quaternary)',
									}}
								>
									<Space vertical size="middle" style={{ width: '100%' }}>
										<div className="flex items-center justify-between">
											<Space>
												<div
													style={{
														width: 40,
														height: 40,
														borderRadius: `${borderRadius}px`,
														background: 'var(--ant-color-info-bg)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<i className="ri-mail-line" style={{ fontSize: 20, color: 'var(--ant-color-info)' }} />
												</div>
												<div>
													<div style={{ fontWeight: 600, fontSize: 16 }}>{t.security.boundEmail}</div>
													<div style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
														{t.security.boundEmailPrefix}
														{profile.email}
													</div>
												</div>
											</Space>
										</div>
										<Button
											block
											icon={<i className="ri-edit-line" />}
											style={{ borderRadius: `${borderRadius}px` }}
											onClick={() => message.info(t.messages.emailChangeInDevelopment)}
										>
											{t.security.changeEmail}
										</Button>
									</Space>
								</ProCard>
							</Col>
						</Row>
					</ProCard>
				</Col>
			</Row>
		</Space>
	);
}

export default Profile;
