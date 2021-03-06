# Generated by Django 3.1.6 on 2021-02-16 14:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0010_auto_20210216_1459'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thermostat',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thermostats', to='restapi.room', unique=True),
        ),
    ]
