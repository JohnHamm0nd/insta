# Generated by Django 3.0.8 on 2021-02-11 16:39

from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20201001_0701'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=imagekit.models.fields.ProcessedImageField(blank=True, help_text='48px * 48px 크기의 png/jpg 파일을 업로드해주세요.', upload_to='accounts/avatar/%Y/%m/%d'),
        ),
    ]