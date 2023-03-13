"""updated field names to be appropriate to code style

Revision ID: 6b73092b76c3
Revises: d7565a6aa38e
Create Date: 2023-03-09 10:51:07.975340

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b73092b76c3'
down_revision = 'd7565a6aa38e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('open_time', sa.Column('opening_time', sa.Integer(), nullable=True))
    op.add_column('open_time', sa.Column('closing_time', sa.Integer(), nullable=True))
    op.drop_column('open_time', 'openingTime')
    op.drop_column('open_time', 'closingTime')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('open_time', sa.Column('closingTime', sa.INTEGER(), nullable=True))
    op.add_column('open_time', sa.Column('openingTime', sa.INTEGER(), nullable=True))
    op.drop_column('open_time', 'closing_time')
    op.drop_column('open_time', 'opening_time')
    # ### end Alembic commands ###
