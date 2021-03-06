# Generated by Django 3.1.6 on 2021-02-10 10:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0003_auto_20210209_1346'),
    ]

    operations = [
        migrations.AlterField(
            model_name='light',
            name='brightness',
            field=models.PositiveSmallIntegerField(blank=True, default=0, validators=[django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='light',
            name='room',
            field=models.CharField(max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='thermostat',
            name='room',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]
