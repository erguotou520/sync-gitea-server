import { getOrganizations, removeOrganization } from '@/api'
import { OrganizationType } from '@/types'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Card, Empty, Modal, message as AntMessage } from 'antd'
import { useRef } from 'react'
import EditOrganizationModal, { EditOrganizationModalActions } from './components/EditModal'

const { useModal } = Modal

const OrganizationsPage = () => {
  const [modal, modalContextHolder] = useModal()
  const [message, messageContextHolder] = AntMessage.useMessage()

  const modalRef = useRef<EditOrganizationModalActions>()

  const request = useRequest<{ list: OrganizationType[]; total: number }, [{ current: number; pageSize: number }]>(
    async () => {
      const { error, data } = await getOrganizations()
      return error ? [] : data
    }
  )

  const confirmDelete = (organization: OrganizationType) => {
    modal.confirm({
      title: `Delete organization "${organization.name}"?`,
      content: 'This operation is irreversible.',
      okButtonProps: { danger: true },
      onOk: async () => {
        const { error } = await removeOrganization(organization.id)
        if (!error) {
          message.success('Organization deleted successfully.')
          request.refresh()
        }
      }
    })
  }

  const createOrganization = () => {
    modalRef.current?.openModal()
  }

  const editOrganization = (organization: OrganizationType) => {
    modalRef.current?.openModal(organization)
  }

  const createBtn = (
    <Button type="dashed" className="flex items-center" onClick={() => createOrganization()}>
      <PlusOutlined /> Create an Organization
    </Button>
  )

  return (
    <>
      {!!request.data?.list.length && createBtn}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {request.data?.list.map(organization => (
          <Card
            key={organization.id}
            title={organization.name}
            actions={[
              <EditOutlined className="cursor-pointer" onClick={() => editOrganization(organization)} />,
              <DeleteOutlined className="!hover:text-red-500 cursor-pointer" onClick={() => confirmDelete(organization)} />
            ]}
          >
            <div className="text-xs italic">created at: {organization.createdAt}</div>
          </Card>
        ))}
      </div>
      {!request.loading && request.data?.list.length === 0 && (
        <Empty className="my-10 flex flex-col items-center justify-center" description="No organizations found.">
          {createBtn}
        </Empty>
      )}
      <EditOrganizationModal actionRef={modalRef} onFinish={() => request.refresh()} />
      {modalContextHolder}
      {messageContextHolder}
    </>
  )
}

export default OrganizationsPage
